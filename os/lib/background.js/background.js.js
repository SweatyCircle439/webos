function bgupdate(){
 
    const background = document.querySelector('.background'); 
     background.style.top =  `${window.scrollY}px`
     document.querySelector('.background').style.position = "absolute";
     window.requestAnimationFrame(bgupdate);
   }
   
   document.addEventListener("DOMContentLoaded", () => {
     const backgroundcon = document.createElement('div');
     backgroundcon.classList.add('background');
     
    const background = document.createElement('div');
     backgroundcon.appendChild(background);
     document.body.prepend(backgroundcon);
     for(let i = 0; i < ((window.innerHeight / 52) - 1); i++){
       const row = document.createElement('div');
       row.classList.add('row');
       background.appendChild(row);
       for(let j = 0; j < (window.innerWidth / 52) + 3; j++){
         const square = document.createElement('div');
         const tile = document.createElement('div');
         square.classList.add('black');
         square.style.left = `${j * 52}px`
         tile.style.width = Math.round(48 + Math.random() * 4) + "px";
         tile.style.height = Math.round(48 + Math.random() * 4) + "px";
         square.appendChild(tile);
         row.appendChild(square);
       }
     }
     bgupdate();
   });