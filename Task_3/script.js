// script.js

// 1. Wait for the Document to be Ready
// $(document).ready() is a core jQuery concept.
// It tells the browser: "Do not run any of the code inside this block until
// the entire HTML structure has been loaded and is visible on the screen."
// If we try to grab the button before it exists on the screen, our code will fail!
$(document).ready(function() {

    // 2. Listen for the Click Event on the Button
    // We use the ID selector '#submit-btn' to find our button in the HTML.
    // The .click() function attaches a "listener". When the user clicks the button,
    // the code inside this block will execute.
    $('#submit-btn').click(function() {

        // 3. Grab the Value from the Input Field
        // We use '#phone-input' to find the text box.
        // The .val() function gets whatever text the user has typed inside that box.
        // We store this text in a variable called 'phoneNumber'.
        var phoneNumber = $('#phone-input').val();

        // 4. Define Validation Rules
        // Let's test for specific mistakes so we can give better error messages.
        
        // Test if it contains anything that is NOT a number (like 'm' or '@')
        var hasLettersOrSymbols = /[^0-9]/.test(phoneNumber);
        
        // Test if all 10 digits are exactly the same
        var isAllSameDigits = /^(\d)\1{9}$/.test(phoneNumber);
        
        // Test if it starts with a valid digit (0, 6, 7, 8, or 9)
        var startsWithValidDigit = /^[06789]/.test(phoneNumber);

        // 5. Run the Tests and Provide Specific Feedback
        
        // Remove old classes so we start fresh before checking
        $('#message').removeClass('success-text error-text');

        // Check 1: Is it exactly 10 characters?
        if (phoneNumber.length !== 10) {
            $('#message').text('Error: Phone number must be exactly 10 digits long.');
            $('#message').addClass('error-text');

        // Check 2: Does it contain letters or symbols? (This catches your 'm' mistake!)
        } else if (hasLettersOrSymbols) {
            $('#message').text('Error: Phone number can only contain numbers.');
            $('#message').addClass('error-text');

        // Check 3: Does it start with the correct digits?
        } else if (!startsWithValidDigit) {
            $('#message').text('Error: Indian phone numbers must start with 0, 6, 7, 8, or 9.');
            $('#message').addClass('error-text');

        // Check 4: Is it a fake number with repeated digits?
        } else if (isAllSameDigits) {
            $('#message').text('Error: Phone number cannot be all the same digit.');
            $('#message').addClass('error-text');

        // If it passes ALL the checks above...
        } else {
            // --- SUCCESS SCENARIO ---
            $('#message').text('Success: Valid Phone Number!');
            $('#message').addClass('success-text');
        }
    });

});
