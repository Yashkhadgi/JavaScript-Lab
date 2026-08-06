// script.js

// --- EMAILJS CONFIGURATION ---
const EMAILJS_SERVICE_ID = "service_ly40fj8"; 
const EMAILJS_TEMPLATE_ID = "template_t4p7f0g";

// State variables to hold our OTP data across different button clicks
var currentOTP = "";
var otpTimer;
var timeLeft = 30;

$(document).ready(function() {
    
    // Initialize EmailJS with the Public Key you provided
    emailjs.init("3WjcXeN1gruVZIGaT");

    // --- STEP 1: INITIAL VALIDATION & SEND OTP ---
    $('#submit-btn').click(function() {
        var email = $('#email-input').val();
        var phoneNumber = $('#phone-input').val();

        // 1. Email Checkpoints
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var isEmailValid = emailPattern.test(email);
        
        // 2. Phone Checkpoints
        var hasLettersOrSymbols = /[^0-9]/.test(phoneNumber);
        var isAllSameDigits = /^(\d)\1{9}$/.test(phoneNumber);
        var startsWithValidDigit = /^[06789]/.test(phoneNumber);

        $('#message').removeClass('success-text error-text');

        // Run Checks sequentially
        if (email === "") {
            $('#message').text('Error: Please enter an email address.').addClass('error-text');
        } else if (!isEmailValid) {
            $('#message').text('Error: Invalid email format.').addClass('error-text');
        } else if (phoneNumber.length !== 10) {
            $('#message').text('Error: Phone number must be exactly 10 digits long.').addClass('error-text');
        } else if (hasLettersOrSymbols) {
            $('#message').text('Error: Phone number can only contain numbers.').addClass('error-text');
        } else if (!startsWithValidDigit) {
            $('#message').text('Error: Indian phone numbers must start with 0, 6, 7, 8, or 9.').addClass('error-text');
        } else if (isAllSameDigits) {
            $('#message').text('Error: Phone number cannot be all the same digit.').addClass('error-text');
        } else {
            // SUCCESS! Both Email and Phone are valid.
            
            // Tell user to wait while we contact EmailJS
            $('#submit-btn').text('Sending...').prop('disabled', true);
            $('#message').text('Contacting email server...').removeClass('error-text success-text');
            
            // Generate 4-digit OTP
            currentOTP = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Prepare the data to send to your EmailJS template
            var templateParams = {
                to_email: email,
                otp_code: currentOTP
            };
            
            // SEND THE REAL EMAIL VIA EMAILJS API
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function(response) {
                    // This block runs if the email was successfully sent!
                    console.log('SUCCESS!', response.status, response.text);
                    
                    $('#message').text('OTP Sent! Please check your email inbox.').removeClass('error-text').addClass('success-text');
                    
                    // Reset the button
                    $('#submit-btn').text('Send OTP to Email').prop('disabled', false);
                    
                    // Hide initial form, show OTP section
                    $('#initial-form').hide();
                    $('#otp-section').show();
                    
                    // Start the Expiration Timer
                    timeLeft = 30;
                    $('#timer-display').text('Expires in: ' + timeLeft + 's').removeClass('timer-red');
                    clearInterval(otpTimer);
                    
                    otpTimer = setInterval(function() {
                        timeLeft--;
                        $('#timer-display').text('Expires in: ' + timeLeft + 's');
                        
                        if (timeLeft <= 10) {
                            $('#timer-display').addClass('timer-red');
                        }
                        
                        if (timeLeft <= 0) {
                            clearInterval(otpTimer);
                            currentOTP = ""; // DESTROY THE OTP
                            $('#timer-display').text('OTP EXPIRED!').addClass('timer-red');
                            $('#message').text('Error: Your OTP has expired. Please refresh to try again.').removeClass('success-text').addClass('error-text');
                            $('#verify-btn').prop('disabled', true);
                        }
                    }, 1000); 
                    
                }, function(error) {
                    // This block runs if the email FAILED to send (e.g. wrong Service ID)
                    console.log('FAILED...', error);
                    $('#submit-btn').text('Send OTP to Email').prop('disabled', false);
                    $('#message').text('Error: Failed to send email. Check console for details.').addClass('error-text');
                });
        }
    });

    // --- STEP 2: VERIFY OTP ---
    $('#verify-btn').click(function() {
        var userEnteredOTP = $('#otp-input').val();
        
        $('#message').removeClass('success-text error-text');
        
        if (currentOTP === "") {
            $('#message').text('Error: OTP has expired or is invalid.').addClass('error-text');
        } else if (userEnteredOTP === currentOTP) {
            // SUCCESS!
            clearInterval(otpTimer);
            $('#timer-display').text('Verified!').removeClass('timer-red');
            $('#message').text('Success: Email and Phone Verified Successfully!').addClass('success-text');
            
            $('#otp-input').hide();
            $('#verify-btn').hide();
        } else {
            $('#message').text('Error: Incorrect OTP. Please try again.').addClass('error-text');
        }
    });
});
