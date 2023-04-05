import FetchService from './service/FetchService.js';

/*-- Objects --*/
const fetchService = new FetchService();
/*-- /Objects --*/

/*--Functions--*/
async function submitContactForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    var regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var returnError = false;

    // 2. Validate the form
    var name = document.getElementById('contact-form').name;
    var email = document.getElementById('contact-form').email;
    var comment = document.getElementById('contact-form').message;
    
    
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
    
    if(!regex_email.test(email.value)){
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

async function submitSubscribeForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    var regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var returnError = false;

    // 2. Validate the form
    var email = document.getElementById('subscribe-form').email;
    
    
    //Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (email.value=='') {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');	
    
    if(!regex_email.test(email.value)){
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');
    
    // Highlight all error fields, then quit.
    if(returnError == true){
        return false;	
    }

    try {
        // 2. Submit the form
        // 2.1 User Interaction
        const btnSubmit = document.getElementById('subscribe-submit');
        btnSubmit.disabled = true;
        setTimeout(() => btnSubmit.disabled = false, 2000);
        // 2.2 Build JSON body
        const jsonFormData = buildJsonFormData(form);
        // 2.3 Build Headers
        const headers = buildHeaders();
        // 2.4 Request & Response
        const response = await fetchService.performPostHttpRequest(`https://k0kivb28mf.execute-api.us-east-2.amazonaws.com/subscribe`, headers, jsonFormData); // Uses JSON Placeholder
        if (response == 'OK'){
            document.getElementById('subscribe-done').style.display = 'block';
            document.getElementById('subscribe-form').email.value = '';
        }
    }
    catch (err) {
        console.error(`Error at submission: ${err}`);
        alert(`Sorry, unexpected error. Please try again later.`);
    } 
}

async function submitDownloadForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    var regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regex_phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var returnError = false;

    // 2. Validate the form
    var name = document.getElementById('download-form').name;
    var email = document.getElementById('download-form').email;
    var company = document.getElementById('download-form').company;
    var jobTitle = document.getElementById('download-form').jobtitle;
    var phone = document.getElementById('download-form').phone;
    
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
    
    if(!regex_email.test(email.value)){
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');
    
    // if (company.value=='') {
    //     company.classList.add('error');
    //     returnError = true;
    // } else company.classList.remove('error');

    // if (jobTitle.value=='') {
    //     jobTitle.classList.add('error');
    //     returnError = true;
    // } else jobTitle.classList.remove('error');

    // if (phone.value=='') {
    //     phone.classList.add('error');
    //     returnError = true;
    // } else phone.classList.remove('error');

    if(phone.value != '' && !regex_phone.test(phone.value)){
        phone.classList.add('error');
        returnError = true;
    } else phone.classList.remove('error');
    
    // Highlight all error fields, then quit.
    if(returnError == true){
        return false;	
    }

    try {
        // 2. Submit the form
        // 2.1 User Interaction
        const btnSubmit = document.getElementById('download-submit');
        btnSubmit.disabled = true;
        setTimeout(() => btnSubmit.disabled = false, 2000);
        // 2.2 Build JSON body
        const jsonFormData = buildJsonFormData(form);
        // 2.3 Build Headers
        const headers = buildHeaders();
        // 2.4 Request & Response
        const response = await fetchService.performPostHttpRequest(`https://k0kivb28mf.execute-api.us-east-2.amazonaws.com/download`, headers, jsonFormData); // Uses JSON Placeholder
        if (response == 'OK'){
            var downloadElement = document.getElementById('download');
            var filename = downloadElement.href.replace(/^.*[\\\/]/, '')
            filename = filename.replace(/%20/g, ' ')
            downloadElement.download = filename;
            downloadElement.click();
            document.getElementById('download').style.display = 'none';
            $("#popupModal").modal("hide");
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
    var colKey = ''
    for (const pair of new FormData(form)) {
        if (pair[0] == 'name')
			colKey = 'From Web: Name';
		else if (pair[0] == 'email')
			colKey = 'From Web: Email';
		else if (pair[0] == 'message')
			colKey = 'From Web: Message';
        else if (pair[0] == 'company')
			colKey = 'From Web: Employer';
        else if (pair[0] == 'jobtitle')
			colKey = 'From Web: Job Title';
        else if (pair[0] == 'phone')
			colKey = 'From Web: Telephone';
        else
            console.error(`Error in building JSON: ${pair[0]} not found.`)
        jsonFormData[colKey] = pair[1];
    }
    return jsonFormData;
}
/*--/Functions--*/

/*--Event Listeners--*/
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        submitContactForm(e, this);
    });
}

const subscribeForm = document.querySelector("#subscribe-form");
if (subscribeForm) {
    subscribeForm.addEventListener("submit", function (e) {
        submitSubscribeForm(e, this);
    });
}

const downloadForm = document.querySelector("#download-form");
if (downloadForm) {
    downloadForm.addEventListener("submit", function (e) {
        submitDownloadForm(e, this);
    });
}
/*--/Event Listeners--*/
