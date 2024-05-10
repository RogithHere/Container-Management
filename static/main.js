function toggleSizes(checkbox) {
    console.log("entered into sizes")
    var sizesContainer = checkbox.parentElement.querySelector('.container-sizes');
    sizesContainer.style.display = checkbox.checked ? 'block' : 'none';
    console.log(checkbox.checked?'block':'none')

    // Uncheck all size checkboxes when container type is unchecked
    if (!checkbox.checked) {
        var sizeCheckboxes = sizesContainer.querySelectorAll('.size-checkbox');
        sizeCheckboxes.forEach(function (sizeCheckbox) {
            sizeCheckbox.checked = false;
            toggleQuantityInput(sizeCheckbox);
        });
    }
    calculateAmount(); // Recalculate amount whenever container type or size selection changes
}

function toggleQuantityInput(sizeCheckbox) {
    console.log("toggle called");
    var quantityInput = sizeCheckbox.parentElement.querySelector('.type-quantity');
    var priceInput = sizeCheckbox.parentElement.querySelector('.type-price');
    var textBoxesContainer = sizeCheckbox.parentElement.querySelector('.text-boxes');
    
    if (sizeCheckbox.checked) {
        // If checkbox is checked, display inputs and text boxes
        quantityInput.style.display = 'block';
        priceInput.style.display = 'block';
        textBoxesContainer.style.display = 'block';

        // Clear existing values
        quantityInput.value = "";
        priceInput.value = "";

        quantityInput.oninput = function () {
            // Update quantity based on the input value
            var quantity = parseInt(quantityInput.value) || 0;

            // Clear existing text boxes
            textBoxesContainer.innerHTML = "";

            // Create text boxes
            for (var i = 1; i <= quantity; i++) {
                var textBox = document.createElement('input');
                textBox.type = 'text';
                textBox.className = 'form-control id-textBoxes';

                var typeCont = sizeCheckbox.parentElement.getAttribute('value');
                var size = sizeCheckbox.value;
                var textBoxID = 'textBox_' + typeCont + '_' + size + '_' + i;
                textBox.id = textBoxID;

                textBox.placeholder = 'Enter Container Number ' + (i );

                textBoxesContainer.appendChild(textBox);
            }

            calculateAmount(); // Calculate amount whenever quantity or price input changes
        };
    } else {
        // If checkbox is unchecked, hide inputs and clear values
        quantityInput.style.display = 'none';
        priceInput.style.display = 'none';
        textBoxesContainer.style.display = 'none';

        // Clear existing values
        quantityInput.value = "";
        priceInput.value = "";

        // Clear text boxes
        textBoxesContainer.innerHTML = "";
    }

    calculateAmount(); // Calculate amount whenever quantity or price input changes
}


// Attach onchange event to size checkboxes
var sizeCheckboxes = document.querySelectorAll('.size-checkbox');
sizeCheckboxes.forEach(function (sizeCheckbox) {
    sizeCheckbox.onchange = function () {
        toggleQuantityInput(sizeCheckbox);
    };
});

function calculateAmount() {
    var totalAmount = 0;

    // Get all checkboxes
    var sizeCheckboxes = document.querySelectorAll('.size-checkbox:checked');


    sizeCheckboxes.forEach(function (checkbox) {
        var checkboxSize = checkbox.value;
        var typeCont=checkbox.parentElement.getAttribute('value');

        console.log(checkboxSize+" "+typeCont)
        var quantityInput = document.querySelector('input[name="typeQuantity[' + typeCont+ ']['+checkboxSize+']');
        var priceInput = document.querySelector('input[name="typePrice[' + typeCont+ ']['+checkboxSize+']');
        
        // Check if both quantity and price inputs exist
        if (quantityInput && priceInput) {
            var quantity = parseInt(quantityInput.value) || 0;
            var price = parseFloat(priceInput.value) || 0;
            totalAmount += quantity * price;
        }
    });

    // Update the amount input
    document.getElementById('amount').value = totalAmount.toFixed(2);
}



// Attach oninput event to quantity and price inputs
var quantityInputs = document.querySelectorAll('.type-quantity');
var priceInputs = document.querySelectorAll('.type-price');

quantityInputs.forEach(function (quantityInput) {
    quantityInput.oninput = calculateAmount;
});

priceInputs.forEach(function (priceInput) {
    priceInput.oninput = calculateAmount;
});


function validateForm() {
    var valid = 0;
    var alertShown=false;
    document.querySelectorAll('.type-checkbox').forEach(function (checkbox) {
        var sizeCount = 0;

        if (checkbox.checked) {
            valid += 1;

            var sizes = checkbox.parentElement.querySelectorAll(".size-checkbox");

            sizes.forEach(function (sizeCheckbox) {
                if (sizeCheckbox.checked) {
                    sizeCount += 1;

                    var quantityElement = sizeCheckbox.parentElement.querySelector('.type-quantity');
                    var priceElement = sizeCheckbox.parentElement.querySelector('.type-price');
                    var textBoxesContainer = sizeCheckbox.parentElement.querySelector('.text-boxes');
                    

                    if (!quantityElement || !priceElement) {
                        alert("Quantity and/or price elements not found");
                        valid=0;
                        alertShown=true;
                        return 0;
                    }

                    var quantity = quantityElement.value;
                    var price = priceElement.value;

                    if (quantity === "" || price === "") {
                        alert("Enter the quantity and prices");
                        valid=0;
                        alertShown=true;

                        return ;
                    }
                    var textBoxes = textBoxesContainer.querySelectorAll('.id-textBoxes');
                    for (var i = 0; i < textBoxes.length; i++) {
                        if (textBoxes[i].value === "") {
                            alert("Fill all text boxes");
                            valid = 0;
                            alertShown = true;
                            return;
                        }
                    }
                }
            });

            if (sizeCount === 0) {
                alert("Select sizes for " + checkbox.value);
                valid=0;
                alertShown=true;
                return ;
            }
            
           
        }
    });
var seller=document.getElementById('seller').value;
var date=document.getElementById('date').value;
var port=document.getElementById('port').value;
var invoice=document.getElementById('invoice').value;
var email=document.getElementById('seller_email').value;
var contact=document.getElementById('seller_contact').value;
var address=document.getElementById('seller_address').value;
if(seller!=""&&date!=""&& port!="" && invoice!=""&& valid!=0&&email!=""&&contact!=""&&address!=""){
    return valid;
}

else if(!alertShown){
    alert("Fill all requirements");
}
}




function confirmPurchase() {
    var numberOfValidSelections=validateForm();
    var purchaseDetails = {
        seller: {
            name: '',
            email: '',
            contact: '',
            address:'',
        },
        containerDetails: [],
        TotalAmount: '',
        port: '',
        date: '',
        invoice: '',
        currentTime:''
    };
    var indiContainers=[]
    
   
    if (numberOfValidSelections > 0) {
      alert("Purchase Added");

        purchaseDetails.seller.name = document.getElementById('seller').value;
        purchaseDetails.seller.email = document.getElementById('seller_email').value;
        purchaseDetails.seller.contact = document.getElementById('seller_contact').value;
        purchaseDetails.seller.address=document.getElementById('seller_address').value;

        var containerCheckboxes = document.querySelectorAll('.type-checkbox:checked');

        containerCheckboxes.forEach(function (checkbox) {
            var selectedType = checkbox.value;
            var sizesContainer = checkbox.parentElement.querySelector('.container-sizes');
            var sizeCheckboxes = sizesContainer.querySelectorAll('.size-checkbox:checked');

            sizeCheckboxes.forEach(function (sizeCheckbox) {
                var selectedSize = sizeCheckbox.value;
                var quantityInput = sizeCheckbox.parentElement.querySelector('.type-quantity');
                var priceInput = sizeCheckbox.parentElement.querySelector('.type-price');
                var textBoxesContainer = sizeCheckbox.parentElement.querySelector('.text-boxes');

                var quantity = quantityInput.value;
                var price = priceInput.value;
                var containerIDs = [];

                // Get container IDs from text boxes
                var textBoxes = textBoxesContainer.querySelectorAll('.id-textBoxes');
                textBoxes.forEach(function (textBox) {
                    containerIDs.push(textBox.value);
                    
                    indiContainers.push({
                        idno: textBox.value,
                        type: selectedType,
                        size: selectedSize,
                        price: '',
                        sold: 0
                    });
                });

                // Add container details to the purchaseDetails object
                purchaseDetails.containerDetails.push({
                    selectedType: selectedType,
                    selectedSize: selectedSize,
                    ids:containerIDs,
                    price:price
                });
                containerIDs = [];
            });
        });
        const currentDate = new Date();
        // Get other details
        purchaseDetails.TotalAmount = document.getElementById('amount').value;
        purchaseDetails.port = document.getElementById('port').value;
        purchaseDetails.date = document.getElementById('date').value;
        purchaseDetails.invoice = document.getElementById('invoice').value;
        purchaseDetails.currentTime=currentDate.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' });

        console.log("Form is valid. Continue with purchase.");
        console.log(purchaseDetails); // You can do whatever you want with the purchaseDetails object

        fetch('/purchase/post', {
            method: 'POST',
            body: JSON.stringify({ purchaseDetails: purchaseDetails ,indiContainers:indiContainers}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display a success message in an alert
                alert('Purchase Added');
                document.getElementById('sellerDetails').innerHTML =

            "Name: "+purchaseDetails.seller.name + '<br>' +
            "Email: "+purchaseDetails.seller.email + '<br>' +
            "Contact: "+purchaseDetails.seller.contact+'<br>'+
            "Address:"+purchaseDetails.seller.address;

        // Update purchase details in the invoice
        var purchaseDetailsBody = document.getElementById('purchaseDetailsBody');
        purchaseDetailsBody.innerHTML = ''; // Clear existing rows

        purchaseDetails.containerDetails.forEach(function (container) {
            var newRow = purchaseDetailsBody.insertRow();

            // Type
            var typeCell = newRow.insertCell(0);
            typeCell.innerHTML = container.selectedType;
            //size 
            var sizeCell=newRow.insertCell(1);
            sizeCell.innerHTML = container.selectedSize;
            // Quantity
            var quantityCell = newRow.insertCell(2);
            quantityCell.innerHTML = container.ids.length;

            // Container IDs
            var containerIDsCell = newRow.insertCell(3);
            containerIDsCell.innerHTML = container.ids.join(', ');

            // Price per Container
            var priceCell = newRow.insertCell(4);
            priceCell.innerHTML = container.price;
        });

        // Update port details in the invoice
        document.getElementById('portDetails').innerHTML = purchaseDetails.port;

        // Update date details in the invoice
        document.getElementById('dateDetails').innerHTML = purchaseDetails.date;

        // Update invoice details in the invoice
        document.getElementById('invoiceDetails').innerHTML = purchaseDetails.invoice;

        // Update total cost in the invoice
        document.getElementById('totalCost').innerHTML = purchaseDetails.TotalAmount;
        
        var invoiceCard = document.querySelector('.hello');
      invoiceCard.style.display = 'block';
      var purchaseCard=document.getElementById('purchase');
      purchaseCard.style.display='none';

            } else {
                alert('Error storing data:'+data.error);
            }
        });
    } else {
        console.log("Error: Form is not valid.");
    }
}



//multiselect
var style = document.createElement('style');
style.setAttribute("id","multiselect_dropdown_styles");
style.innerHTML = `
.multiselect-dropdown{
  display: inline-block;
  padding: 2px 5px 0px 5px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background-color: white;
  position: relative;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right .75rem center;
  background-size: 16px 12px;
}
.multiselect-dropdown span.optext, .multiselect-dropdown span.placeholder{
  margin-right:0.5em; 
  margin-bottom:2px;
  padding:1px 0; 
  border-radius: 4px; 
  display:inline-block;
}
.multiselect-dropdown span.optext{
  background-color:lightgray;
  padding:1px 0.75em; 
}
.multiselect-dropdown span.optext .optdel {
  float: right;
  margin: 0 -6px 1px 5px;
  font-size: 0.7em;
  margin-top: 2px;
  cursor: pointer;
  color: #666;
}
.multiselect-dropdown span.optext .optdel:hover { color: #c66;}
.multiselect-dropdown span.placeholder{
  color:#ced4da;
}
.multiselect-dropdown-list-wrapper{
  box-shadow: gray 0 3px 8px;
  z-index: 100;
  padding:2px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  display: none;
  margin: -1px;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  background: white;
}
.multiselect-dropdown-list-wrapper .multiselect-dropdown-search{
  margin-bottom:5px;
}
.multiselect-dropdown-list{
  padding:2px;
  height: 15rem;
  overflow-y:auto;
  overflow-x: hidden;
}
.multiselect-dropdown-list::-webkit-scrollbar {
  width: 6px;
}
.multiselect-dropdown-list::-webkit-scrollbar-thumb {
  background-color: #bec4ca;
  border-radius:3px;
}

.multiselect-dropdown-list div{
  padding: 5px;
}
.multiselect-dropdown-list input{
  height: 1.15em;
  width: 1.15em;
  margin-right: 0.35em;  
}
.multiselect-dropdown-list div.checked{
}
.multiselect-dropdown-list div:hover{
  background-color: #ced4da;
}
.multiselect-dropdown span.maxselected {width:100%;}
.multiselect-dropdown-all-selector {border-bottom:solid 1px #999;}
`;
document.head.appendChild(style);

function MultiselectDropdown(options){
  var config={
    search:true,
    height:'15rem',
    placeholder:'select',
    txtSelected:'selected',
    txtAll:'All',
    txtRemove: 'Remove',
    txtSearch:'search',
    ...options
  };
  function newEl(tag,attrs){
    var e=document.createElement(tag);
    if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
      if(k==='class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)}
      else if(k==='style'){  
        Object.keys(attrs[k]).forEach(ks=>{
          e.style[ks]=attrs[k][ks];
        });
       }
      else if(k==='text'){attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
      else e[k]=attrs[k];
    });
    return e;
  }

  
  document.querySelectorAll("select[multiple]").forEach((el,k)=>{
    
    var div=newEl('div',{class:'multiselect-dropdown',style:{width:config.style?.width??el.clientWidth+'px',padding:config.style?.padding??''}});
    el.style.display='none';
    el.parentNode.insertBefore(div,el.nextSibling);
    var listWrap=newEl('div',{class:'multiselect-dropdown-list-wrapper'});
    var list=newEl('div',{class:'multiselect-dropdown-list',style:{height:config.height}});
    var search=newEl('input',{class:['multiselect-dropdown-search'].concat([config.searchInput?.class??'form-control']),style:{width:'100%',display:el.attributes['multiselect-search']?.value==='true'?'block':'none'},placeholder:config.txtSearch});
    listWrap.appendChild(search);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    el.loadOptions=()=>{
      list.innerHTML='';
      
      if(el.attributes['multiselect-select-all']?.value=='true'){
        var op=newEl('div',{class:'multiselect-dropdown-all-selector'})
        var ic=newEl('input',{type:'checkbox'});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:config.txtAll}));
  
        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;
          
          var ch=op.querySelector("input").checked;
          list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")
            .forEach(i=>{if(i.style.display!=='none'){i.querySelector("input").checked=ch; i.optEl.selected=ch}});
  
          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
        });
  
        list.appendChild(op);
      }

      Array.from(el.options).map(o=>{
        var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
        var ic=newEl('input',{type:'checkbox',checked:o.selected});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:o.text}));

        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;
          op.optEl.selected=!!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
        });
        o.listitemEl=op;
        list.appendChild(op);
      });
      div.listEl=listWrap;
      div.refreshDropdown = () => {
        div.listEl.style.display = 'none';
        div.refresh();
    };

      div.refresh=()=>{
        div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
        var sels=Array.from(el.selectedOptions);
        if(sels.length>(el.attributes['multiselect-max-items']?.value??5)){
          div.appendChild(newEl('span',{class:['optext','maxselected'],text:sels.length+' '+config.txtSelected}));          
        }
        else{
          sels.map(x=>{
            var c=newEl('span',{class:'optext',text:x.text, srcOption: x});
            if((el.attributes['multiselect-hide-x']?.value !== 'true'))
              c.appendChild(newEl('span',{class:'optdel',text:'🗙',title:config.txtRemove, onclick:(ev)=>{c.srcOption.listitemEl.dispatchEvent(new Event('click'));div.refresh();ev.stopPropagation();}}));

            div.appendChild(c);
          });
        }
        if(0==el.selectedOptions.length) div.appendChild(newEl('span',{class:'placeholder',text:el.attributes['placeholder']?.value??config.placeholder}));
      };
      div.refresh();
    }
    el.loadOptions();
    
    search.addEventListener('input',()=>{
      list.querySelectorAll(":scope div:not(.multiselect-dropdown-all-selector)").forEach(d=>{
        var txt=d.querySelector("label").innerText.toUpperCase();
        d.style.display=txt.includes(search.value.toUpperCase())?'block':'none';
      });
    });

    div.addEventListener('click',()=>{
      div.listEl.style.display='block';
      search.focus();
      search.select();
    });
    
    document.addEventListener('click', function(event) {
      if (!div.contains(event.target)) {
        listWrap.style.display='none';
        div.refresh();
      }
    });    
  });
}

window.addEventListener('load',()=>{
  MultiselectDropdown(window.MultiselectDropdownOptions);
});


//multiselectend

//toget selected values




function validateSell() {
  var customerName = document.getElementById('customer').value;
  var customerEmail = document.getElementById('customer_email').value;
  var customerContact = document.getElementById('customer_contact').value;
  var customerAddress = document.getElementById('customer_email').value;
  var selectedContainers = document.getElementById('sellMultiContainer').selectedOptions;
  var amount = document.getElementById('amount').value;
  var date = document.getElementById('date').value;
  var selectedPort = document.getElementById('port').value;
  var invoiceNumber = document.getElementById('invoice').value;

  // Check if any of the fields are empty
  if (
      customerName === '' ||
      customerEmail === '' ||
      customerContact === '' ||
      selectedContainers.length === 0 ||
      amount === '' ||
      date === '' ||
      selectedPort === '' ||
      invoiceNumber === ''||
      customerAddress===''
  ) {
      alert('Please fill in all the required fields.');
      return false;
  }

  // Validate dynamically added text boxes in container-prices div

  var containerPricesInputs = document.getElementById('container-prices').getElementsByTagName('input');
  for (var i = 0; i < containerPricesInputs.length; i++) {
      if (containerPricesInputs[i].value === '' || containerPricesInputs[i].value == 0) {
          alert('Please fill the prices');
          return false;
      }
  }
  return true;
}

function confirmSell(){
  var validation=validateSell();
  
  var sellDetails = {
    customer: {
        name: '',
        email: '',
        contact: '',
        address:'',
    },
    containerDetails: [],
    TotalAmount: '',
    port: '',
    date: '',
    invoice: '',
    currentTime:'',
};
var indiContainers=[]

  if(validation){
     // Get seller information
      alert("Success");
     sellDetails.customer.name = document.getElementById('customer').value;
     sellDetails.customer.email = document.getElementById('customer_email').value;
     sellDetails.customer.contact = document.getElementById('customer_contact').value;
     sellDetails.customer.address = document.getElementById('customer_address').value;

     var containerPricesInputs = document.getElementById('container-prices').getElementsByTagName('input');
Array.from(containerPricesInputs).forEach(function (textBox) {
  console.log(textBox.id)
 var IdParts = textBox.id.split('-');
    
    console.log("ID Parts:",IdParts);
        sellDetails.containerDetails.push({
        idno: IdParts[0],
        type: IdParts[1],
        size: IdParts[2],
        price: textBox.value,
        sold:1,
        InvoiceType:"Sold"
    });
});
    const currentDate = new Date();
    
     sellDetails.TotalAmount = document.getElementById('amount').value;
     sellDetails.port = document.getElementById('port').value;
     sellDetails.date = document.getElementById('date').value;
     
     sellDetails.invoice = document.getElementById('invoice').value;
     sellDetails.currentTime=currentDate.toLocaleString('en-IN',{dateStyle:'full',timeStyle:'medium'})

    var indiContainers=sellDetails.containerDetails;
    console.log(indiContainers)
    fetch('/sell/post', {
      method: 'POST',
      body: JSON.stringify({ sellDetails,indiContainers}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Display a success message in an alert
          alert('sold');
          document.getElementById('CustomerDetails').innerHTML =

  "Name: "+sellDetails.customer.name + '<br>' +
  "Email: "+sellDetails.customer.email + '<br>' +
  "Contact: "+sellDetails.customer.contact+'<br>'+
  "Address:"+sellDetails.customer.address;

// Update purchase details in the invoice
var sellDetailsBody = document.getElementById('sellDetailsBody');
sellDetailsBody.innerHTML = ''; // Clear existing rows

sellDetails.containerDetails.forEach(function (container) {
  var newRow = sellDetailsBody.insertRow();

  // Type
  var typeCell = newRow.insertCell(0);
  typeCell.innerHTML = container.type;
  //size 
  var sizeCell=newRow.insertCell(1);
  sizeCell.innerHTML = container.size;
  

  // Container IDs
  var containerIDsCell = newRow.insertCell(2);
  containerIDsCell.innerHTML = container.idno;

  // Price per Container
  var priceCell = newRow.insertCell(3);
  priceCell.innerHTML = container.price;
});

// Update port details in the invoice
document.getElementById('portDetails').innerHTML = sellDetails.port;

// Update date details in the invoice
document.getElementById('dateDetails').innerHTML = sellDetails.date;

// Update invoice details in the invoice
document.getElementById('invoiceDetails').innerHTML = sellDetails.invoice;

// Update total cost in the invoice
document.getElementById('totalCost').innerHTML =sellDetails.TotalAmount;

var invoiceCard = document.querySelector('.sale');
invoiceCard.style.display = 'block';
var sellCard=document.getElementById('sell');
sellCard.style.display='none';
      } else {
          alert('Error storing data:'+data.error);
      }
  });

  
} else {
console.log("Error: Form is not valid.");
}
}




function validateLease() {
  var customerName = document.getElementById('customer').value;
  var customerEmail = document.getElementById('customer_email').value;
  var customerContact = document.getElementById('customer_contact').value;
  var customerAddress = document.getElementById('customer_address').value;
  var selectedContainers = document.getElementById('leaseMultiContainer').selectedOptions;
  var amount = document.getElementById('amount').value;
  var fromDate = document.getElementById('fromDate').value;
  var toDate = document.getElementById('toDate').value;
  var selectedPort = document.getElementById('port').value;
  var invoiceNumber = document.getElementById('invoice').value;

  // Check if any of the fields are empty
  if (
      customerName === '' ||
      customerEmail === '' ||
      customerContact === '' ||
      customerAddress===''||
      selectedContainers.length === 0 ||
      amount === '' ||
      fromDate === '' ||
      toDate === '' ||
      selectedPort === '' ||
      invoiceNumber === ''
  ) {
      alert('Please fill in all the required fields.');
      return false;
  }

  // Validate dynamically added text boxes in container-prices div

  var containerPricesInputs = document.getElementById('container-prices').getElementsByTagName('input');
  for (var i = 0; i < containerPricesInputs.length; i++) {
      if (containerPricesInputs[i].value === '' || containerPricesInputs[i].value == 0) {
          alert('Please fill the prices');
          return false;
      }
  }
  return true;
}


function confirmLease(){
  var validation=validateLease();
  
  var leaseDetails = {
    customer: {
        name: '',
        email: '',
        contact: '',
        address:'',
    },
    containerDetails: [],
    TotalAmount: '',
    port: '',
    fromDate: '',
    toDate:'',
    invoice: '',
    currentTime:'',
};
var indiContainers=[]

  if(validation){
     
      alert("Success");
     leaseDetails.customer.name = document.getElementById('customer').value;
     leaseDetails.customer.email = document.getElementById('customer_email').value;
     leaseDetails.customer.contact = document.getElementById('customer_contact').value;
     leaseDetails.customer.address = document.getElementById('customer_address').value;
     var containerPricesInputs = document.getElementById('container-prices').getElementsByTagName('input');
Array.from(containerPricesInputs).forEach(function (textBox) {
  console.log(textBox.id)
 var IdParts = textBox.id.split('-');
    
    console.log("ID Parts:",IdParts);
        leaseDetails.containerDetails.push({
        idno: IdParts[0],
        type: IdParts[1],
        size: IdParts[2],
        price: textBox.value,
        sold:1,
        InvoiceType:"Lease"
    });
});
  var currentDate=new Date();
    // Get other details
     leaseDetails.TotalAmount = document.getElementById('amount').value;
     leaseDetails.port = document.getElementById('port').value;
     leaseDetails.fromDate = document.getElementById('fromDate').value;
     leaseDetails.toDate = document.getElementById('toDate').value;
     leaseDetails.invoice = document.getElementById('invoice').value;
     leaseDetails.currentTime=currentDate.toLocaleString('en-IN',{dateStyle:'full',timeStyle:'medium'})

    var indiContainers=leaseDetails.containerDetails;
    console.log(indiContainers)
    fetch('/lease/post', {
      method: 'POST',
      body: JSON.stringify({ leaseDetails ,indiContainers}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Display a success message in an alert
          alert('sold');
      } else {
          alert('Error storing data:'+data.error);
      }
  });

  document.getElementById('CustomerDetails').innerHTML =

  "Name: "+leaseDetails.customer.name + '<br>' +
  "Email: "+leaseDetails.customer.email + '<br>' +
  "Contact: "+leaseDetails.customer.contact+'<br>'+
  "Address: "+leaseDetails.customer.address;

// Update purchase details in the invoice
var leaseDetailsBody = document.getElementById('leaseDetailsBody');
leaseDetailsBody.innerHTML = ''; // Clear existing rows

leaseDetails.containerDetails.forEach(function (container) {
  var newRow =leaseDetailsBody.insertRow();

  // Type
  var typeCell = newRow.insertCell(0);
  typeCell.innerHTML = container.type;
  //size 
  var sizeCell=newRow.insertCell(1);
  sizeCell.innerHTML = container.size;
  

  // Container IDs
  var containerIDsCell = newRow.insertCell(2);
  containerIDsCell.innerHTML = container.idno;

  // Price per Container
  var priceCell = newRow.insertCell(3);
  priceCell.innerHTML = container.price;
});

// Update port details in the invoice
document.getElementById('portDetails').innerHTML = leaseDetails.port;

// Update date details in the invoice
document.getElementById('fromDateDetails').innerHTML = leaseDetails.fromDate;

document.getElementById('toDateDetails').innerHTML = leaseDetails.toDate;

// Update invoice details in the invoice
document.getElementById('invoiceDetails').innerHTML = leaseDetails.invoice;

// Update total cost in the invoice
document.getElementById('totalCost').innerHTML =leaseDetails.TotalAmount;

var invoiceCard = document.querySelector('.lease');
invoiceCard.style.display = 'block';
var sellCard=document.getElementById('lease');
sellCard.style.display='none';

} else {
console.log("Error: Form is not valid.");
}
}

function generateInvoice(objectID){
  console.log(objectID)
  fetch('/expenses/invoice', {
    method: 'POST',
    body: JSON.stringify({objectID}),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response=>response.json())
.then(data=>{
  console.log(data)
  console.log(data.details.invoiceType)

  if(data.details.invoiceType=='Purchase'){
    var purchaseDetails =data.details;
    console.log(purchaseDetails)
    document.getElementById('sellerDetails').innerHTML =

            "Name: "+purchaseDetails.seller.name + '<br>' +
            "Email: "+purchaseDetails.seller.email + '<br>' +
            "Contact: "+purchaseDetails.seller.contact+'<br>'+
            "Address:"+purchaseDetails.seller.address;

        // Update purchase details in the invoice
        var purchaseDetailsBody = document.getElementById('purchaseDetailsBody');
        purchaseDetailsBody.innerHTML = ''; // Clear existing rows

        purchaseDetails.containerDetails.forEach(function (container) {
            var newRow = purchaseDetailsBody.insertRow();

            // Type
            var typeCell = newRow.insertCell(0);
            typeCell.innerHTML = container.selectedType;
            //size 
            var sizeCell=newRow.insertCell(1);
            sizeCell.innerHTML = container.selectedSize;
            // Quantity
            var quantityCell = newRow.insertCell(2);
            quantityCell.innerHTML = container.ids.length;

            // Container IDs
            var containerIDsCell = newRow.insertCell(3);
            containerIDsCell.innerHTML = container.ids.join(', ');

            // Price per Container
            var priceCell = newRow.insertCell(4);
            priceCell.innerHTML = container.price;
        });

        // Update port details in the invoice
        document.getElementById('purchasePortDetails').innerHTML = purchaseDetails.port;

        // Update date details in the invoice
        document.getElementById('purchaseDateDetails').innerHTML = purchaseDetails.date;

        // Update invoice details in the invoice
        document.getElementById('purchaseInvoiceDetails').innerHTML = purchaseDetails.invoice;

        // Update total cost in the invoice
        document.getElementById('purchaseTotalCost').innerHTML = purchaseDetails.TotalAmount;
        
      var invoiceCard = document.querySelector('.hello');
      invoiceCard.style.display = 'block';
      var purchaseCard=document.getElementById('expense_table');
      purchaseCard.style.display='none';
    
  }
  else if(data.details.invoiceType=='Sold'){
    var sellDetails=data.details;
    document.getElementById('sellCustomerDetails').innerHTML =

    "Name: "+sellDetails.customer.name + '<br>' +
    "Email: "+sellDetails.customer.email + '<br>' +
    "Contact: "+sellDetails.customer.contact+"<br>"+
    "Address: "+sellDetails.customer.address;
  
  // Update purchase details in the invoice
  var sellDetailsBody = document.getElementById('sellDetailsBody');
  sellDetailsBody.innerHTML = ''; // Clear existing rows
  
  sellDetails.containerDetails.forEach(function (container) {
    var newRow = sellDetailsBody.insertRow();
  
    // Type
    var typeCell = newRow.insertCell(0);
    typeCell.innerHTML = container.type;
    //size 
    var sizeCell=newRow.insertCell(1);
    sizeCell.innerHTML = container.size;
    
  
    // Container IDs
    var containerIDsCell = newRow.insertCell(2);
    containerIDsCell.innerHTML = container.idno;
  
    // Price per Container
    var priceCell = newRow.insertCell(3);
    priceCell.innerHTML = container.price;
  });
  
  // Update port details in the invoice
  document.getElementById('sellPortDetails').innerHTML = sellDetails.port;
  
  // Update date details in the invoice
  document.getElementById('sellDateDetails').innerHTML = sellDetails.date;
  
  // Update invoice details in the invoice
  document.getElementById('sellInvoiceDetails').innerHTML = sellDetails.invoice;
  
  // Update total cost in the invoice
  document.getElementById('sellTotalCost').innerHTML =sellDetails.TotalAmount;
  
  var invoiceCard = document.querySelector('.sale');
  invoiceCard.style.display = 'block';
  var sellCard=document.getElementById('expense_table');
  sellCard.style.display='none';
  }
  else if(data.details.invoiceType=='Lease'){
    var leaseDetails=data.details;
    document.getElementById('leaseCustomerDetails').innerHTML =

  "Name: "+leaseDetails.customer.name + '<br>' +
  "Email: "+leaseDetails.customer.email + '<br>' +
  "Contact: "+leaseDetails.customer.contact+"<br>"+
  "Address: "+leaseDetails.customer.address;

// Update purchase details in the invoice
var leaseDetailsBody = document.getElementById('leaseDetailsBody');
leaseDetailsBody.innerHTML = ''; // Clear existing rows

leaseDetails.containerDetails.forEach(function (container) {
  var newRow =leaseDetailsBody.insertRow();

  // Type
  var typeCell = newRow.insertCell(0);
  typeCell.innerHTML = container.type;
  //size 
  var sizeCell=newRow.insertCell(1);
  sizeCell.innerHTML = container.size;
  

  // Container IDs
  var containerIDsCell = newRow.insertCell(2);
  containerIDsCell.innerHTML = container.idno;

  // Price per Container
  var priceCell = newRow.insertCell(3);
  priceCell.innerHTML = container.price;
});

// Update port details in the invoice
document.getElementById('leasePortDetails').innerHTML = leaseDetails.port;

// Update date details in the invoice
document.getElementById('leaseFromDateDetails').innerHTML = leaseDetails.fromDate;

document.getElementById('leaseToDateDetails').innerHTML = leaseDetails.toDate;

// Update invoice details in the invoice
document.getElementById('leaseInvoiceDetails').innerHTML = leaseDetails.invoice;

// Update total cost in the invoice
document.getElementById('leaseTotalCost').innerHTML =leaseDetails.TotalAmount;

var invoiceCard = document.querySelector('.lease');
invoiceCard.style.display = 'block';
var sellCard=document.getElementById('expense_table');
sellCard.style.display='none';

  }
})
.catch(error => console.error('Error fetching data:', error));
}


function seller_table(){
  var sellerTable=document.getElementById('seller');
  var customer_cont=document.getElementById('customer');
  customer_cont.style.display='none';
  var seller_cont=document.getElementById('seller_table');
  seller_cont.style.display="block";
  while (sellerTable.rows.length > 1) {
    sellerTable.deleteRow(1);
  }
  console.log('clicked')
  fetch('/seller_details')
  .then(response=>response.json())
  .then(data=>{
    console.log(data)
      if(data.success){
        data.sellers.forEach(seller => {
          console.log("entered")
          var row = sellerTable.insertRow();
          var nameCell = row.insertCell(0);
          var emailCell = row.insertCell(1);
          var phoneCell = row.insertCell(2);
          var address=row.insertCell(3)
          var idsCell = row.insertCell(4);
          var amountCell = row.insertCell(5);
          

          nameCell.textContent = seller.name;
          emailCell.textContent = seller.email;
          idsCell.textContent = seller.containerIds.join(', ');
          amountCell.textContent = seller.TotalAmount;
          phoneCell.textContent=seller.contact;
          address.textContent=seller.address;
      });
  }
  else{
      console.log('failed')
  }
})
.catch(error => console.error('Error fetching data:', error));
}

function customer_table(){
  console.log('sell arived')
  var customerTable=document.getElementById('customer_sell');
  while (customerTable.rows.length > 1) {
    customerTable.deleteRow(1);
  }
  fetch('/sellCustomer_details')
  .then(response=>response.json())
  .then(data=>{
    console.log("sellerData:",data)
      if(data.success){
        data.customers.forEach(customer => {
          console.log("entered")
          var row = customerTable.insertRow();
          var nameCell = row.insertCell(0);
          var emailCell = row.insertCell(1);
          var phoneCell = row.insertCell(2);
          var address=row.insertCell(3)
          var idsCell = row.insertCell(4);
          
          var amountCell = row.insertCell(5);
          

          nameCell.textContent = customer.name;
          emailCell.textContent = customer.email;
          idsCell.textContent = customer.containerIds.join(', ');
          amountCell.textContent = customer.TotalAmount;
          phoneCell.textContent=customer.contact;
          address.textContent=customer.address;
      });
  }
  else{
      console.log('failed')
  }
})
.catch(error => console.error('Error fetching data:', error));

console.log('lease arived')
  var customerTableLease=document.getElementById('customer_lease');
  while (customerTableLease.rows.length > 1) {
    customerTableLease.deleteRow(1);
  }
  fetch('/leaseCustomer_details')
  .then(response=>response.json())
  .then(data=>{
    console.log("leaseData:",data)
      if(data.success){
        data.customers.forEach(customer => {
          console.log("entered")
          var row = customerTableLease.insertRow();
          var nameCell = row.insertCell(0);
          var emailCell = row.insertCell(1);
          var phoneCell = row.insertCell(2);
          var address=row.insertCell(3)
          var idsCell = row.insertCell(4);
          
          var amountCell = row.insertCell(5);
          nameCell.textContent = customer.name;
          emailCell.textContent = customer.email;
          idsCell.textContent = customer.containerIds.join(', ');
          amountCell.textContent = customer.TotalAmount;
          phoneCell.textContent=customer.contact;
          address.textContent=customer.address;
      });
  }
  else{
      console.log('failed')
  }
})
.catch(error => console.error('Error fetching data:', error));
var customer_cont=document.getElementById('customer');
  customer_cont.style.display='block';
  var seller_cont=document.getElementById('seller_table');
  seller_cont.style.display="none";
}
function increaseContainerAvailability(containerType) {
  var containerAvailability = document.getElementById(containerType + "-availability");
  var currentAvailability = parseInt(containerAvailability.textContent);
  var newAvailability = currentAvailability + 1;
  containerAvailability.textContent = newAvailability + " Containers available";
}

 function displayContainer(typeVal){
  fetch('/containersDetails/'+typeVal)
  .then(response=>response.json())
  .then(data=>{
    console.log(data.values);
    var availContainers=document.getElementById("availContainer");
    var containerTable=document.getElementById("container_table");
    var availableContainers=document.getElementById("available_containers");
    while (availableContainers.rows.length > 1) {
      availableContainers.deleteRow(1);
    }
    data.values.forEach(container => {
      console.log("entered")
      var row = availableContainers.insertRow();
      var IdCell = row.insertCell(0);
      var typeCell = row.insertCell(1);
      var SizeCell = row.insertCell(2);
  
      IdCell.textContent = container.idno;
      typeCell.textContent = container.type;;
      SizeCell.textContent =container.size;
      
  });
  availContainers.style.display="none";
  containerTable.style.display="block";

  })
  .catch(error=>console.error('Error fetching data:', error));
  
 }


 function printDiv(InvoiceId){
  var printContents = document.getElementById(InvoiceId).innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
 }