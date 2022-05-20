AFRAME.registerComponent("menu", {
    init: async function () {
        var dishes= await this.getDishes()
        console.log(dishes)

        var scene= document.querySelector("#scene") 
        dishes.map(dish=>{ 
            var marker= document.createElement("a-marker") 
            marker.setAttribute("id", dish.id), 
            marker.setAttribute("type", "pattern") 
            marker.setAttribute("url", dish.marker_pattern_url), 
            marker.setAttribute("cursor", { "rayOrigin":"mouse"})
            marker.setAttribute("markerhandler", {})
            marker.setAttribute("visible", true) 
            scene.appendChild(marker)
            console.log(marker)


            var today = new Date();
            var currentDay = today.getDay();
            // Sunday - Saturday : 0 - 6
            //var dish = dishes.filter(dish => dish.id === markerId)[0];
            var days = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday"
            ];


            if (!dish.unavailable.includes(days[currentDay])) {
            var model = document.createElement("a-entity")
            model.setAttribute("id", `model-${dish.id}`)
            model.setAttribute("position", dish.model_geometry.position)
            model.setAttribute("rotation", dish.model_geometry.rotation)
            model.setAttribute("scale", dish.model_geometry.scale)
            model.setAttribute("gltf-model", `url(${dish.model_url})`)
            model.setAttribute("gesture-handler",{})
            model.setAttribute("visible", false)
            marker.appendChild(model)
            

            var plane = document.createElement("a-plane")
            plane.setAttribute("id", `plane-${dish.id}`)
            plane.setAttribute("position",{
                x:0,
                y:0,
                z:0,
            })
            plane.setAttribute("rotation",{
                x:-90,
                y:0,
                z:0,
            })
            plane.setAttribute("width",1.5)
            plane.setAttribute("height",1.5)
            plane.setAttribute("material",{
                color:"orange",
            })
            plane.setAttribute("visible",false)
            marker.appendChild(plane)






            var plane1 = document.createElement("a-plane")
            plane1.setAttribute("id", `plane1-${dish.id}`)
            plane1.setAttribute("position",{
                x:0,
                y:0.89,
                z:0.02,
            })
            plane1.setAttribute("rotation",{
                x:0,
                y:0,
                z:0,
            })
            plane1.setAttribute("width",1.49)
            plane1.setAttribute("height",0.3)
            plane1.setAttribute("material",{
                color:"white",
            })
            plane1.setAttribute("visible",false)
            plane.appendChild(plane1)


            var text1 = document.createElement("a-entity")
            text1.setAttribute("id",`text1-${dish.id}`)
            text1.setAttribute("position",{
                x:0,
                y:0,
                z:0.1,
            })
            text1.setAttribute("rotation",{   
                x:0,
                y:0,
                z:0,
            })
            text1.setAttribute("text",{
                font:"monoid",
                value: dish.dishname,
                color:"black",
                width: 1.8,
                height:1,
                align:"center",
            })
            text1.setAttribute("visible",true)
            plane1.appendChild(text1)




            var text2 = document.createElement("a-entity")
            text2.setAttribute("id",`text2-${dish.id}`)
            text2.setAttribute("position",{
                x:0,
                y:0,
                z:0.1,
            })
            text2.setAttribute("rotation",{   
                x:0,
                y:0,
                z:0,
            })
            text2.setAttribute("text",{
                font:"monoid",
                value: dish.ingredients.join("\n\n"),
                color:"black",
                width: 2,
                height:1,
                align:"center",
            })
            text2.setAttribute("visible",true)
            plane.appendChild(text2)

            var pricePlane = document.createElement("a-image")
            pricePlane.setAttribute("id", `pricePlane-${dish.id}`);
            pricePlane.setAttribute(
              "src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
              
            );
            pricePlane.setAttribute("width",0.8 );
            pricePlane.setAttribute("height",0.8);
            pricePlane.setAttribute("position", { 
                x: 1.3 , 
                y: 0 , 
                z: 0.3,   
            });
            pricePlane.setAttribute("rotation", { 
                x:-90 , 
                y:0 , 
                z:0  
            });
            pricePlane.setAttribute("visible",false) ;
            marker.appendChild(pricePlane)

            price = document.createElement("a-entity"); 
            price.setAttribute("id", `price-${dish.id}`); 
            price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 }); 
            price.setAttribute("rotation", { x: 0, y: 0, z: 0 }); 
            price.setAttribute("text", { 
                font: "mozillavr", 
                color: "white", 
                width: 3, 
                align: "center", 
                value: `Only\n ₹${dish.price}`});


            pricePlane.appendChild(price)

            


            }


            

        })


        


    
    },
    
    getDishes: async function (){
    return await firebase.firestore().collection("Dishes").get()
    .then(snapshot => {
        return snapshot.docs.map(doc=>
            doc.data()
        )
    })

  }

})
