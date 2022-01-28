// Toggle Scripts

// Accordions

// Handler
function h2AccordionToggleHandler(accordion) {
  // Get the trigger from the accordion - make sure we're not getting nested accordions.
  var children = accordion.children;
  var trigger = "";
  var content = "";
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.classList.contains("accordion-trigger")) {
      trigger = child;
    } else if (child.classList.contains("accordion-content")) {
      content = child;
    }
  }
  // Set the trigger as the default focus target. This will be manually checked later in the event the user has specified one.
  var focusTarget = trigger;
  // Check to see if the accordion is active or not.
  if (accordion.classList.contains("accordion-active") == false) {
    // Open the accordion and set the proper accessibility features.
    trigger.setAttribute("aria-expanded", true);
    accordion.classList.add("accordion-active");
    content.setAttribute("aria-hidden", false);
    // Check for a manual focus target and ensure it's focusable, and then focus it.
    if (content.querySelector(".focus-target") != null) {
      focusTarget = content.querySelector(".focus-target");
      focusTarget.setAttribute("tabindex", "0");
    }
    else {
      // Find the focusable items in the content and focus the first item.
      var focusList = content.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      // Ensure that there are in fact items to be focused in the content.
      if (focusList.length != 0) {
        focusTarget = focusList[0];
      }
    }
    focusTarget.focus();
    return true;
  }
  else {
    // Check for a manual focus target and ensure it's removed from the tab order.
    if (content.querySelector(".focus-target") != null) {
      content.querySelector(".focus-target").setAttribute("tabindex", "-1");
    }
    // Close the accordion and remove accessibility values.
    trigger.setAttribute("aria-expanded", false);
    accordion.classList.remove("accordion-active");
    content.setAttribute("aria-hidden", true);
    return false;
  }
}

// Event
function h2AccordionToggleEvent(e) {
  // Get the accordion's trigger.
  var trigger = e.currentTarget;
  // Get the accordion itself.
  var accordion = trigger.closest(".accordion");
  // Prevent the trigger's default behaviour.
  e.preventDefault();
  // Check to see if the accordion has been manually disabled.
  if (accordion.hasAttribute("data-h2-no-js") == false) {
    // Activate the accordion.
    h2AccordionToggleHandler(accordion);
  }
}

// Event Listener
function h2AccordionToggle(targetAccordions) {
  // Run the system version check.
  var accordions = targetAccordions;
  // Loop through the triggers, and add the event trigger script.
  if (accordions != false) {
    accordions.forEach(function(accordion) {
      accordion.removeEventListener("click", h2AccordionToggleEvent);
      accordion.addEventListener("click", h2AccordionToggleEvent);
    });
  }
}

var accordions = document.querySelectorAll('.accordion-trigger');
h2AccordionToggle(accordions);