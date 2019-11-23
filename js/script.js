const list = document.querySelectorAll('.student-item');
const track = [...list]; //we need this variable to keep track of the students filtered after search
const itemsPerPage = 10;
const pagesNum = list.length/itemsPerPage;

// this function displays students from the big list in sets of itemsPerPage
const showPage = (list, page) => {
  const start = page * itemsPerPage - itemsPerPage;
  const end = page * itemsPerPage;

  for (let i = 0; i < list.length; i++) {
     list[i].style.display = 'none';

     if (i >= start && i < end) {
       list[i].style.display = 'block';
     }
  }
};

//will create, set event listeners on and append the page links
const appendPageLinks = (list) => {
   const pagination = document.createElement('DIV');
   const ul = document.createElement('UL');
   
   let page = 1;

   for (let i = 0; i < pagesNum; i++) {
      const li = document.createElement('LI');
      const a = document.createElement('A');
      
      a.setAttribute('href', '#');

      if (i === 0) {
         a.className = 'active'; //the number 1 page link will be active at first
      }
      a.textContent = i + 1; //index is zero-based but I want my page links start from one
      a.addEventListener('click', (e) => {
         const aList = document.getElementsByTagName('A');
         for (let i = 0; i < aList.length; i++) {
            aList[i].classList.remove('active'); //will remove active class to further set it to a clicked link
         }

         e.target.className = 'active';
         page = parseInt(e.target.textContent); //getting a page number from a textContent string of the link
         showPage(track, page); //calling this to display different sets of 10 on every link click
         
      });


      li.appendChild(a);
      ul.appendChild(li);
   }
   pagination.className = 'pagination';
   pagination.appendChild(ul);
   
   document.querySelector('body').appendChild(pagination);
   showPage(track, page); //calling showpage for the first pagelink since innitially page variable equals one
};

appendPageLinks(track);

//appending search input to the page
const addSearch = () => {
   const div = document.createElement('DIV');
   const input = document.createElement('INPUT');
   const button = document.createElement('BUTTON');

   div.className = 'student-search';
   input.setAttribute('placeholder', 'Search for students...');
   button.textContent = 'Search';

   div.appendChild(input);
   div.appendChild(button);

   document.querySelector('.page-header').appendChild(div);
}

addSearch();


//we need these variables to further implement a complex input functionality
const input = document.querySelector('input');
const names = document.querySelectorAll('li h3');
const pageLinks = document.querySelectorAll('.pagination li');


input.addEventListener('input', () => {
   
   for (let i = 0; i < names.length; i++) {

      //we'll be filering through student names
      const name = names[i].textContent.toLocaleLowerCase();

      //at first I display all filtered students regardless of the pagination
      //if a student name matches our inout value for a moment it's display will be set to 'block'
      if(name.indexOf(input.value.toLocaleLowerCase()) === -1) {
         list[i].style.display = 'none';
      } else {
         list[i].style.display = 'block';
      };
      //that's a way to keep all filtered students inside a track array
      if (list[i].style.display === 'block') {
         if (track.indexOf(list[i]) === -1) { //if you don't set this condition every time you press a keyboard key on input
             track.push(list[i]);             //all displayed elements from the list will be pushed to the array even if 
         }                                    //the element's already been pushed there during the previous loop ececution
      } else {
         if (track.indexOf(list[i]) !== -1) {           //same principle here, we only want to splice elements that don't show anymore
            track.splice(track.indexOf(list[i]), 1);    //and that were in the array
         }
      }

      const notShown = track.slice(10);               //once we're done with tracking the filtered elements
      for (let i = 0; i < notShown.length; i++) {     //we can hide the displayed elements starting from the 10th index of the track array
         notShown[i].style.display = 'none';          //so that the pagination was there as before
      }
      
     
   }
   

   // here we will be showing and hiding page links according to the amount of
   // displayed students (previously there amount of pages was all the list devided by ten
   // from here it will be all displayed students devided by ten)

   const newPagesNum = Math.ceil(track.length / itemsPerPage);
   const pages = document.querySelectorAll('.pagination li');
   const ul = document.querySelector('.student-list');
   const notFound = document.createElement('P');
   notFound.textContent = 'No students found';

   for (let i = Math.ceil(pagesNum) - 1; i > -1; i--) {  //starting the loop from the end of the pagesNum collection
                                          
      if (i >= newPagesNum) {                            //we will not show the links which indeces are more than
         pages[i].style.display = 'none';                //the amount of pages that we need

         
         //add and remove notFound message if there're no students with the entered name
         if (newPagesNum === 0) {
            
            if (ul.lastChild.tagName !== 'P') {

            ul.appendChild(notFound);                    

            }

         } else {

            if (ul.lastChild.tagName === 'P') {

            ul.removeChild(ul.lastChild);

            }
         }
      } else {

         pages[i].style.display = 'inline';       //to show the links back dynamically 

      }

      //add an event listener to the page links again
      //after the track array has been changed
      
      pages[i].addEventListener('click', (e) => {
         const aList = document.getElementsByTagName('A');
         for (let i = 0; i < aList.length; i++) {
            aList[i].classList.remove('active');
         }

         e.target.className = 'active';
         page = parseInt(e.target.textContent);
         showPage(track, page);
         
      });
   }
})

