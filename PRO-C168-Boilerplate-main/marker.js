var tableNumber=  null;


AFRAME.registerComponent("markerhandler", {
  init: async function () {

    var dishes = await this.getDishes()
    if(tableNumber == null){
      this.addTableNumber()

    }

    this.el.addEventListener("markerFound", () => {
      if(tableNumber !== null){
        var markerId = this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }

  
    });

    this.el.addEventListener("markerLost", () => {

      this.handleMarkerLost();
    });
  },


  addTableNumber: function(){
    swal({
      icon: "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png",
      title: "WELCOME TO CHEESE HUNGER BURGER !!",
      content: {
        element: "input",
        attributes: {
          placeholder: "Type the Table Number",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false
    }).then((inputvalue)=>{
      tableNumber=inputvalue
    })
  },

  handleMarkerFound: function (dishes, markerId) {

    var today = new Date();
    var currentDay = today.getDay();
    // Sunday - Saturday : 0 - 6

    var dish = dishes.filter(dish => dish.id === markerId)[0];

    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

   

    if (dish.unavailable.includes(days[currentDay])) {
      swal({
        icon: "warning",
        title: dish.dishname,
        text: "This dish is not available....HAVE FUNNN HUNGRRRYYYYY!!!!!!!!!!!!!",
        timer: 2000,
        buttons: false
      });
    }
    else {

      var model = document.querySelector(`#model-${dish.id}`);
      model.setAttribute("visible", true);
       
    


      var plane = document.querySelector(`#plane-${dish.id}`)
      plane.setAttribute("visible", true);

  

      var priceplane = document.querySelector(`#pricePlane-${dish.id}`);
      priceplane.setAttribute("visible", true)


      model.setAttribute("position", dish.model_geometry.position);
      model.setAttribute("rotation", dish.model_geometry.rotation);
      model.setAttribute("scale", dish.model_geometry.scale);

      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";


      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");
      var orderSummary = document.getElementById("order-summary-button");
      var payButton = document.getElementById("pay-button")



      orderSummary.addEventListener("click",()=>{ this.handleSummary() })

      payButton.addEventListener("click",()=>{ 
        this.handlePayment() 
      })


      ratingButton.addEventListener("click",  ()=> {
        this.handleRating(dish)
      });

      
   
    orderButtton.addEventListener("click", () => {
      var tNumber
      tableNumber<=5?(tNumber =`T0${tableNumber}`):`T${tableNumber}`
      this.orderDish(tNumber, dish);
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order!",
        text: "Your order will be served soon at your table!"
      });
    });
  


  }
    },


  handleMarkerLost: function () {

    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },




  getDishes: async function (){
    return await firebase.firestore().collection("Dishes").get()
    .then(snapshot => {
        return snapshot.docs.map(doc=>
            doc.data()
        )
    })

  },


  orderDish:function(tNumber, dish){



    firebase.firestore().collection("tables").doc(tNumber).get()
    .then(doc => {
      var TableDetails = doc.data()
      if(TableDetails["current_order"][dish.id]){
        TableDetails["current_order"][dish.id]["Total_Quantity"]+=1

        var currentQuant = TableDetails["current_order"][dish.id]["Total_Quantity"]
        TableDetails["current_order"][dish.id]["Total_bill"] = currentQuant*dish.price
      }
      else{
        TableDetails["current_order"][dish.id]={
          Item:dish.dishname,
          Price:dish.price,
          Total_Quantity:1,
          Total_bill:dish.price*1

        }

      }


      TableDetails.total_bill+= dish.price
      firebase.firestore().collection("tables").doc(doc.id).update(TableDetails)
    })
  },

  getOrderSummary: async function(tNumber){
    return await firebase.firestore().collection("tables").doc(tNumber).get()
      .then(doc => doc.data())

  },


  handleSummary: async function(){
    var modeldiv = document.getElementById("modal-div")
    modeldiv.style.display="flex"


    var tableBody = document.getElementById("bill-table-body")
    tableBody.innerHTML=""



    var tNumber
    tableNumber<=5?(tNumber =`T0${tableNumber}`):`T${tableNumber}`
     


    var OrderDetails= await this.getOrderSummary(tNumber)
    var currentOrders = Object.keys(OrderDetails.current_order)
    currentOrders.map(i=>{
      var tr= document.createElement("tr")
      var item = document.createElement("td")
      var price = document.createElement("td")
      var quantity = document.createElement("td")
      var Total = document.createElement("td")



      item.innerHTML = OrderDetails.current_order[i].Item
      price.innerHTML = OrderDetails.current_order[i].Price
      quantity.innerHTML = OrderDetails.current_order[i].Total_Quantity
      Total.innerHTML = OrderDetails.current_order[i].Total_bill

      price.setAttribute("class", "text-center")
      quantity.setAttribute("class", "text-center")
      Total.setAttribute("class", "text-center")

      tr.appendChild(item)
      tr.appendChild(price)
      tr.appendChild(quantity)
      tr.appendChild(Total)


      tableBody.appendChild(tr)
      
    })



  },


  handlePayment: function (){
    document.getElementById("modal-div").style.display="none"
    var tNumber
    tableNumber<=5?(tNumber =`T0${tableNumber}`):`T${tableNumber}`


    firebase.firestore().collection("tables").doc(tNumber).update({
      current_order:{},
      total_bill:0,
    })
    .then(()=>{
      swal({
        icon: "success",
        title: "Thanks for cheese",
        timer:2500,
        button:false
      });
    })
    

  },




  handleRating:async function (dish){
    var tNumber
    tableNumber<=5?(tNumber =`T0${tableNumber}`):`T${tableNumber}`


    var orderSummary= await this.getOrderSummary(tNumber)
    var currentOrders = Object.keys(orderSummary.current_order)

    if(currentOrders.length>0 && currentOrders == dish.id){


      document.getElementById("rating-modal-div").style.display="flex"
      document.getElementById("rating-input").value="0"
      document.getElementById("feedback-input").value= " "


      var save= document.getElementById("save-rating-button") 
      save.addEventListener("click",()=>{ 
      document.getElementById("rating-modal-div").style.display="none" 
      rating = document.getElementById("rating-input").value 
      feedback= document.getElementById("feedback-input").value 
      

      firebase.firestore().collection("Dishes").doc(dish.id).update({
        lastRating: rating,
        lastReview: feedback
      })
      then(()=>{
        swal({
          icon: "success",
          title: "Thanks for cheese rating",
          timer:2500,
          button:false
        });
      })
    
    
    })
    }




  }

});