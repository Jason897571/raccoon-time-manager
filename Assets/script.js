/* 
GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with time blocks for standard business hours of 9am to 5pm
WHEN I view the time blocks for that day
THEN each time block is color-coded to indicate whether it is in the past, present, or future
WHEN I click into a time block
THEN I can enter an event
WHEN I click the save button for that time block
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist
 */

/* 
1. need to show current day in the top
2. create blocks for 9am to 5pm
3. color the blocks regarding past,peresent,future 
4. when clicking a block, an event can be edited
5. when clicking a save button, save data to the local storage
6. the data should persist
*/

let block_container = $('.block-container');

// create time block for schedule from 9am to 5pm
create_blocks = function(hour){
  // To determine how the time display in first column
  if(hour < 12){
    var time_present = hour + "AM"
  }
  else if(hour == 12){
    var time_present = hour + "PM"
  }
  else{
    var time_present = (hour -12) + "PM"
  }
  


  let time_block = $("<div>")
  time_block.attr("id",`hour-${hour}`)
  time_block.addClass('row time-block'); // may add past present future
  block_container.append(time_block);


  let hour_element = $("<div>");
  hour_element.addClass('col-2 col-md-1 hour text-center py-3');
  hour_element.text(time_present);
  time_block.append(hour_element);


  let text_element = $("<textarea>");
  text_element.addClass('col-8 col-md-10 textarea');
  text_element.attr('rows',"3")
  time_block.append(text_element);

  let save_button = $("<button>");
  save_button.addClass('btn saveBtn col-2 col-md-1');
  save_button.attr("aria-label","save")
  time_block.append(save_button);

  let icon_element = $("<i>");
  icon_element.addClass("fas fa-save");
  icon_element.attr("aria-hidden","true")
  save_button.append(icon_element);


}

// loop to create time blocks
for(let i = 9; i < 18; i++){
  create_blocks(i);
}


$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  let block_container = $('.block-container');
  block_container.on('click', function(event){
    let target_element = event.target;

    if(target_element.classList.contains('saveBtn')){
      // get data from input text and hour id
      let input_text = $(target_element).prev().val();
      let parent_hour_id = $(target_element).parent().attr('id');

      //get local data
      let save_data = [];

      if(JSON.parse(localStorage.getItem("data"))){
        save_data = JSON.parse(localStorage.getItem("data"));
      }

      let new_data = {
        "hour_id": parent_hour_id,
        "description": input_text};
      // find the index of the new data in local data
      let data_index = save_data.findIndex(local_item => local_item.hour_id === new_data.hour_id)

      // if new data is not in local data
      if(data_index === -1){
        save_data.push(new_data);
      }
      else{
        save_data[data_index] = new_data;
      }

      localStorage.setItem("data", JSON.stringify(save_data));
    }
  });




  // Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  let time_blocks = $(".time-block");
  

  $.each(time_blocks, function(index, time_block){

    $(time_block).removeClass("past present future")
    let block_id = parseInt(time_block.id.replace("hour-", ""));
    if(block_id < dayjs().hour()){
      $(time_block).addClass("past")
    } 
    else if(block_id == dayjs().hour()){
      $(time_block).addClass("present")
    }
    else{
      $(time_block).addClass("future")
    }
    console.log(block_id)

  })

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  let local_data = JSON.parse(localStorage.getItem("data"));

  if(local_data){
    $.each(local_data, function(index, data){
       let time_block = $("#" + data["hour_id"]);
       let text_area = time_block.find("textarea")
       text_area.text(data["description"])
  })}



  // Add code to display the current date in the header of the page.

  let current_day_element = $('#currentDay');
  // set up the time display 
  setInterval(function(){
    let current_time = dayjs().format('dddd, MMMM D YYYY  HH:mm:ss');
    current_day_element.text(current_time);
  }, 1000);
});
