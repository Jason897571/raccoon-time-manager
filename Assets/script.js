let block_container = $(".block-container");

// create time block for schedule from 9am to 5pm
create_blocks = function (hour) {
  // To determine how the time display in first column
  if (hour < 12) {
    var time_present = hour + "AM";
  } else if (hour == 12) {
    var time_present = hour + "PM";
  } else {
    var time_present = (hour - 12) + "PM";
  }

  let time_block = $("<div>");
  time_block.attr("id", `hour-${hour}`);
  time_block.addClass(`row time-block`);
  block_container.append(time_block);

  let hour_element = $("<div>");
  hour_element.addClass("col-2 col-md-1 hour text-center py-3");
  hour_element.text(time_present);
  hour_element.attr("hour",time_present)
  time_block.append(hour_element);

  let text_element = $("<textarea>");
  text_element.addClass("col-8 col-md-10 textarea");
  text_element.attr("rows", "3");
  time_block.append(text_element);

  let save_button = $("<button>");
  save_button.attr("type", "button");
  save_button.addClass("btn saveBtn col-2 col-md-1 btn-primary");
  save_button.attr("data-bs-toggle", "modal");
  save_button.attr("data-bs-target", "#exampleModal");

  save_button.attr("aria-label", "save");
  time_block.append(save_button);

  let icon_element = $("<i>");
  icon_element.addClass("fas fa-save");
  icon_element.attr("aria-hidden", "true");
  save_button.append(icon_element);
};

// loop to create time blocks
for (let i = 9; i < 18; i++) {
  create_blocks(i);
}

$(function () {
  // Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage.
  let block_container = $(".block-container");
  let time_blocks = $(".time-block");

  // add a date picker
  let today = new Date();
  $("#datepicker").datepicker();

  // Show selected date
  let current_date = $("#selected-date");
  let date_picker = $("#datepicker");
  date_picker.datepicker("setDate", today);

  // set up today's date attribute
  $.each(time_blocks, function (index, time_block) {
    $(time_block).attr("date", date_picker.val());
  });

  current_date.text("Selected Date: " + date_picker.val());

  var set_up_today_time_blocks = function(time_block){
    let block_id = parseInt(time_block.id.replace("hour-", ""));
    // change the color for each time block
    if (block_id < dayjs().hour()) {
      $(time_block).addClass("past");
    } else if (block_id == dayjs().hour()) {
      $(time_block).addClass("present");
    } else {
      $(time_block).addClass("future");
    }

    // update hour block
    let hour_block = $(time_block).children(".hour").first();
    hour_block.text(hour_block.attr("hour"))

  }


  // Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour.

  // defaut setup for today
  $.each(time_blocks, function(index, time_block){
    $(time_block).removeClass("past");
    $(time_block).removeClass("present");
    $(time_block).removeClass("future");
    set_up_today_time_blocks(time_block);

  })

  // Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements.

  let local_data = JSON.parse(localStorage.getItem("data"));

  if (local_data) {
    $.each(local_data, function (index, data) {
      let time_block = $("#" + data["hour_id"]);

      if(data["date"] == time_block.attr("date")){
        let text_area = time_block.find("textarea");
        text_area.text(data["description"]);

      }

    });
  }

  // Add code to display the current date in the header of the page.

  let current_day_element = $("#currentDay");
  // set up the time display
  setInterval(function () {
    let current_time = dayjs().format("dddd, MMMM D, YYYY -- HH:mm:ss");
    current_day_element.text(current_time);
  }, 1000);



  block_container.on("click", function (event) {
    let target_element = event.target;

    if (target_element.classList.contains("saveBtn")) {
      // get data from input text and hour id
      let input_text = $(target_element).prev().val(); // input text area
      let parent_hour_id = $(target_element).parent().attr("id"); // time block id
      let hour_element_text = $(target_element).prev().prev().attr("hour"); // displayed hour in first column
      let date_text = $(target_element).parent().attr("date") //selected date
      let pop_up_element = $("#pop-up");

      //get local data
      let save_data = [];

      if (JSON.parse(localStorage.getItem("data"))) {
        save_data = JSON.parse(localStorage.getItem("data"));
      }

      let new_data = {
        hour_id: parent_hour_id,
        description: input_text,
        date:date_text,
      };
      // find the index of the new data in local data
      let data_index = save_data.findIndex(
        (local_item) => local_item.hour_id === new_data.hour_id && local_item.date === new_data.date
      );

      // if new data is not in local data
      if (data_index === -1) {
        save_data.push(new_data);
      } else {
        save_data[data_index] = new_data;
      }

      // update pop-up to confirm updates
      if (new_data.description.trim() === "") {
        pop_up_element.text(
          `You input nothing or your schedule has been removed from ${hour_element_text} on ${date_text}`
        );
      } else {
        pop_up_element.text(
          `${input_text} has been added to ${hour_element_text} on ${date_text}`
        );
      }

      // save to localstorage
      localStorage.setItem("data", JSON.stringify(save_data));
    }
  });




  // change the date attribute when the value of datepicker is changed
  date_picker.on("change", function () {
    current_date.text("Selected Date: " + date_picker.val());
    $("#pop-up").text("");
    // when the date changes, the presentation of time block will change 
    $.each(time_blocks, function (index, time_block) {

      //clear any content in text area for future import
      let text_area = $(time_block).find("textarea");
      
      text_area.val("")
      
      // assign date attribute to time block
      $(time_block).attr("date", date_picker.val());
      // remove time class from time block
      $(time_block).removeClass("past");
      $(time_block).removeClass("present");
      $(time_block).removeClass("future");

      // compare date today with the date picked
      let time_block_date = $(time_block).attr("date");
      let today_date = dayjs().format("MM/DD/YYYY");
      

      if (time_block_date < today_date) {
        $(time_block).addClass("past");
        let hour_block = $(time_block).find(".hour").first()

        hour_block.text(`${time_block_date}\n${hour_block.attr("hour")}`)
        
      } else if (time_block_date == today_date) {
        set_up_today_time_blocks(time_block);
      } else {
        $(time_block).addClass("future");
        let hour_block = $(time_block).find(".hour").first()

        hour_block.text(`${time_block_date}\n${hour_block.attr("hour")}`)
      }

      
      let local_data = JSON.parse(localStorage.getItem("data"));

      if (local_data) {
        let matchingData = local_data.find(data =>data.hour_id === $(time_block).attr("id") && data.date === $(time_block).attr("date"));
        
        if (matchingData) {
          
          text_area.val(matchingData.description);
        }
        
      }
    });
  });


  
});
