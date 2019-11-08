function loadPage(){
    var bloques = document.getElementsByClassName("Appointment-appointment-300");
    var boton = document.createElement("a");
    boton.setAttribute("href","/dashboardfin");

      for (var i = bloques.length - 1; i >= 0; i--){
        bloques[i].appendChild(boton);
        bloques[i].addEventListener("click", function(event){
            window.location.replace("http://localhost:3000/dashboardfin");
        });
      }
    }
window.addEventListener("load", loadPage);