import FetchService from './service/FetchService.js';

/*-- Objects --*/
const fetchService = new FetchService();
/*-- /Objects --*/

/*--Functions--*/
async function submitForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    // 2. Validate the form
    var name = document.getElementById('contact-form').name;
    var email = document.getElementById('contact-form').email;
    var regx = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/i;
    var comment = document.getElementById('contact-form').message;
    var returnError = false;
    
    //Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (name.value=='') {
        name.classList.add('error');
        returnError = true;
    } else name.classList.remove('error');
    
    if (email.value=='') {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');	
    
    if(!regx.test(email.value)){
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');
    
    
    if (comment.value=='') {
        comment.classList.add('error');
        returnError = true;
    } else comment.classList.remove('error');
    
    // Highlight all error fields, then quit.
    if(returnError == true){
        return false;	
    }

    try {
        // 2. Submit the form
        // 2.1 User Interaction
        const btnSubmit = document.getElementById('contact-submit');
        btnSubmit.disabled = true;
        setTimeout(() => btnSubmit.disabled = false, 2000);
        // 2.2 Build JSON body
        const jsonFormData = buildJsonFormData(form);
        // 2.3 Build Headers
        const headers = buildHeaders();
        // 2.4 Request & Response
        const response = await fetchService.performPostHttpRequest(`https://k0kivb28mf.execute-api.us-east-2.amazonaws.com/contact`, headers, jsonFormData); // Uses JSON Placeholder
        if (response == 'OK'){
            document.getElementById('contact-done').style.display = 'block';
            document.getElementById('contact-form').name.value = '';
            document.getElementById('contact-form').email.value = '';
            document.getElementById('contact-form').message.value = '';
        }
    }
    catch (err) {
        console.error(`Error at submission: ${err}`);
        alert(`Sorry, unexpected error. Please try again later.`);
    } 
}

function buildHeaders() {
    const headers = {
        "Content-Type": "application/json",
    };
    return headers;
}

function buildJsonFormData(form) {
    const jsonFormData = {};
    for (const pair of new FormData(form)) {
        jsonFormData['From Web: ' + pair[0]] = pair[1];
    }
    return jsonFormData;
}
/*--/Functions--*/

/*--Event Listeners--*/
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        submitForm(e, this);
    });
}
/*--/Event Listeners--*/
