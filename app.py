from flask import Flask, render_template, request, jsonify,redirect,url_for
from bson import ObjectId
from flask_pymongo import PyMongo
import traceback
app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/Container-management'
mongod = PyMongo(app)
print(mongod)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/main')
def home():
    return render_template('main.html')

@app.route('/purchase')
def purchase():
    return render_template('purchase.html')

@app.route('/sell')
def sell():
    return render_template('sell.html')

@app.route('/lease')
def lease():
    return render_template('lease.html')

@app.route('/transactions')
def expenses():
    return render_template('expenses.html')

@app.route('/customer')
def customer():
    return render_template('customer.html')


@app.route('/authenticate',methods=['POST'])
def authenticate():
    try:
        name=request.form['user-id']
        password =request.form['user-pass']
        user =mongod.db.admin.find_one({'username':name,'password':password})
        email=mongod.db.admin.find_one({'email':name,'password':password})
        if user is None and email is None :
            return redirect(url_for('login'))
        else:
            return redirect(url_for('home'))
    except Exception as e:
        return jsonify({'message': 'Error during authentication', 'error': str(e)})


@app.route('/purchase/post', methods=['POST'])
def purchase_store():
    try:
        print("entered in upload")
        data = request.get_json()
        purchaseDetails = data.get('purchaseDetails')
        purchase_dict = dict(purchaseDetails)

        # Retrieve existing seller data
        existing_seller = mongod.db.sellerDetails.find_one({'name': purchase_dict['seller']['name']})
        if existing_seller:
        # Update or insert seller details
            for container_detail in purchase_dict['containerDetails']:
                mongod.db.sellerDetails.update_many(
            {'name': purchase_dict['seller']['name']},
            {'$addToSet': {'containerIds': {'$each': [container_detail['ids']]}},
             '$inc': {'TotalAmount': float(purchase_dict['TotalAmount'])}},
            upsert=False
        )
        else:
            # Insert new seller details
            sellerDict = {
                'name': purchase_dict['seller']['name'],
                'email': purchase_dict['seller']['email'],
                'contact': purchase_dict['seller']['contact'],
                'address': purchase_dict['seller']['address'],
                'containerIds': [],
                'TotalAmount': float(purchase_dict['TotalAmount'])
            }

            for container_detail in purchase_dict['containerDetails']:
                sellerDict['containerIds'].extend(container_detail['ids'])
            mongod.db.sellerDetails.insert_one(sellerDict)

        # Insert purchase details
        mongod.db.purchaseDetails.insert_one(purchase_dict)

        # Add invoice type and insert into expenses
        purchase_dict['invoiceType'] = 'Purchase'
        mongod.db.expenses.insert_one(purchase_dict)

        # Print purchase details
        print(purchaseDetails)

        # Insert individual containers
        indiContainers = data.get('indiContainers')
        mongod.db.containers.insert_many(indiContainers)

        return jsonify({'success': True})

    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)})
        


@app.route('/container-details', methods=['GET'])
def containerDetails():
    try:
        print("entered in retrieve")
        containers = list(mongod.db.containers.find({'sold':0}))
        # Convert ObjectId to str for serialization
        for container in containers:
            container['_id'] = str(container['_id'])
        
        return jsonify({'success': True, 'containers': containers})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/sell/post',methods=['POST'])
def sell_store():
    try:
        print("entered in sell")
        data=request.get_json()
        sellDetails=data.get('sellDetails')
        sell_dict = dict(sellDetails)
        print(sell_dict)
        existing_customer=mongod.db.sellCustomerDetails.find_one({'name':sell_dict['customer']['name']})
        if existing_customer:
            for container in sell_dict['containerDetails']:
                mongod.db.sellCustomerDetails.update_many({'name':sell_dict['customer']['name']},
                {
                '$addToSet':{'containerIds':{'$each':[container['idno']]}},
                '$inc':{'TotalAmount':float(sell_dict['TotalAmount'])}
                },
                upsert=False                                      
                )

        else:
            print('Entered in SellCustomer')
            customerDict = {
                'name': sell_dict['customer']['name'],
                'email': sell_dict['customer']['email'],
                'contact': sell_dict['customer']['contact'],
                'address': sell_dict['customer']['address'],
                'containerIds': [container['idno'] for container in sell_dict['containerDetails']],
                'TotalAmount': float(sell_dict['TotalAmount']),
            }

            print(sell_dict['containerDetails'])
            mongod.db.sellCustomerDetails.insert_one(customerDict)
        #print(sellDetails)
        indiContainers=data.get('indiContainers')
        ##indi_dict=dict(indiContainers)
        print(indiContainers)
        for indi in indiContainers:
            mongod.db.containers.update_one({'idno': indi['idno']}, {'$set': indi})

        mongod.db.sellDetails.insert_one(sell_dict)
        sell_dict['invoiceType']='Sold'
        mongod.db.expenses.insert_one(sell_dict)
       
        return jsonify({'success': True})
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/lease/post',methods=['POST'])
def lease_store():
    try:
        print("entered in lease")
        data=request.get_json()
        leaseDetails=data.get('leaseDetails')
        lease_dict = dict(leaseDetails)
        print(lease_dict)

        existing_customer=mongod.db.leaseCustomerDetails.find_one({'name':lease_dict['customer']['name']})
        if existing_customer:
            for container in lease_dict['containerDetails']:
                mongod.db.leaseCustomerDetails.update_many({'name':lease_dict['customer']['name']},
                {
                '$addToSet':{'containerIds':{'$each':[container['idno']]}},
                '$inc':{'TotalAmount':float(lease_dict['TotalAmount'])}
                },
                upsert=False                                      
                )

        else:
            print('Entered in SellCustomer')
            customerDict = {
                'name': lease_dict['customer']['name'],
                'email': lease_dict['customer']['email'],
                'contact': lease_dict['customer']['contact'],
                'address': lease_dict['customer']['address'],
                'containerIds': [container['idno'] for container in lease_dict['containerDetails']],
                'TotalAmount': float(lease_dict['TotalAmount']),
            }

            mongod.db.leaseCustomerDetails.insert_one(customerDict)

        indiContainers=data.get('indiContainers')
        #indi_dict=dict(indiContainers)
        #print(indiContainers)
        for indi in indiContainers:
            mongod.db.containers.update_one({'idno': indi['idno']}, {'$set': indi})

        mongod.db.leaseDetails.insert_one(lease_dict)
        lease_dict['invoiceType']='Lease'
        mongod.db.expenses.insert_one(lease_dict)
       
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/expenses/details', methods=['GET'])
def get_expenses():
    try:
        print("entered in expenses")
        expenses = list(mongod.db.expenses.find())  # Convert cursor to list
        print(expenses)
        
        # Convert ObjectId objects to string representation
        for expense in expenses:
            expense['_id'] = str(expense['_id'])

        return jsonify({'success': True, 'expenses': expenses})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    
@app.route('/expenses/invoice',methods=['POST'])
def get_invoice():
    try:
        data = request.get_json()
        objId = data.get('objectID')
        print(objId)
        detail = mongod.db.expenses.find_one({'_id': ObjectId(objId)})
        detail['_id'] = str(detail['_id'])  # Convert ObjectId to string representation
        print(detail)
        return jsonify({'success': True, 'details': detail})  # Return the detail object directly

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
        
@app.route('/seller_details',methods=['GET'])
def get_seller():
    try:
        data=list(mongod.db.sellerDetails.find())
        for item in data:
            item['_id'] = str(item['_id'])
        return jsonify({'success':True,'sellers':data})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)})

@app.route('/sellCustomer_details',methods=['GET'])
def get_sell_customer():
    try:
        data=list(mongod.db.sellCustomerDetails.find())
        for item in data:
            item['_id'] = str(item['_id'])
        return jsonify({'success':True,'customers':data})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)})
    
@app.route('/leaseCustomer_details',methods=['GET'])
def get_lease_customer():
    try:
        data=list(mongod.db.leaseCustomerDetails.find())
        for item in data:
            item['_id'] = str(item['_id'])
        return jsonify({'success':True,'customers':data})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)})


@app.route('/containersDetails/<string:typeVal>',methods=['GET'])
def availableCOntainers(typeVal):
    try:
        containerType=typeVal
        print(containerType)
        values=list(mongod.db.containers.find({'type':containerType,'sold':0}))
        for item in values:
            item['_id'] = str(item['_id'])
        return jsonify({'success':True,'values':values})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5005)