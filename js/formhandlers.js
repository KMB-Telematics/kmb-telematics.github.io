import FetchService from './service/FetchService.js';

/*-- Objects --*/
const fetchService = new FetchService();
/*-- /Objects --*/

/*-- RegEx --*/
let regex_email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
let regex_phone = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
/*-- /RegEx --*/

/*--Functions--*/
async function submitContactForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    var returnError = false;

    // 2. Validate the form
    var name = form.name;
    var email = form.email;
    var subject = form.subject;
    var comment = form.message;

    //Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (name.value == '') {
        name.classList.add('error');
        returnError = true;
    } else name.classList.remove('error');

    if (email.value == '') {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    if (!regex_email.test(email.value)) {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    if (subject.value == 'default') {
        subject.classList.add('error');
        returnError = true;
    } else if (subject.value == 'others') {
        var othersubject = form.othersubject;
        if (othersubject.value == '') {
            othersubject.classList.add('error');
            returnError = true;
        } else othersubject.classList.remove('error');
    } else subject.classList.remove('error');

    if (comment.value == '') {
        comment.classList.add('error');
        returnError = true;
    } else comment.classList.remove('error');

    // Highlight all error fields, then quit.
    if (returnError == true) {
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
        if (response == 'OK') {
            document.getElementById('contact-done').style.display = 'block';
            form.name.value = '';
            form.email.value = '';
            if (form.subject.value == 'others') {
                form.othersubject.value = '';
                document.getElementById('other-subject').style.display = 'none';
            }
            form.subject.value = 'default';
            form.message.value = '';
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

    var returnError = false;

    // 2. Validate the form
    var email = form.email;


    //Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (email.value == '') {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    if (!regex_email.test(email.value)) {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    // Highlight all error fields, then quit.
    if (returnError == true) {
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
        if (response == 'OK') {
            document.getElementById('subscribe-done').style.display = 'block';
            form.email.value = '';
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

    var returnError = false;

    // 2. Validate the form
    var name = form.name;
    var email = form.email;
    var company = form.company;
    var jobTitle = form.jobtitle;
    var phone = form.phone;

    //2.1 Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (name.value == '') {
        name.classList.add('error');
        returnError = true;
    } else name.classList.remove('error');

    if (email.value == '') {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    if (!regex_email.test(email.value)) {
        email.classList.add('error');
        returnError = true;
    } else email.classList.remove('error');

    if (phone.value != '' && !regex_phone.test(phone.value)) {
        phone.classList.add('error');
        returnError = true;
    } else phone.classList.remove('error');

    // 2.2 Highlight all error fields, then quit.
    if (returnError == true) {
        return false;
    }

    try {
        // 3. Submit the form
        // 3.1 User Interaction
        const btnSubmit = form.elements["submit"];
        btnSubmit.disabled = true;
        setTimeout(() => btnSubmit.disabled = false, 2000);
        // 3.2 Build JSON body
        const jsonFormData = buildJsonFormData(form);
        // 3.3 Build Headers
        const headers = buildHeaders();
        // 3.4 Request & Response
        const response = await fetchService.performPostHttpRequest(`https://k0kivb28mf.execute-api.us-east-2.amazonaws.com/download`, headers, jsonFormData); // Uses JSON Placeholder
        if (response == 'OK') {
            // 3.4.1 Click on the hidden button
            form.elements["hidden-button"].click();
            // 3.4.2 Clear all the fields
            form.name.value = '';
            form.email.value = '';
            form.company.value = '';
            form.jobtitle.value = '';
            form.phone.value = '';
            // 3.4.3 Hide the modal window
            $(".modal").modal("hide");
        }
    }
    catch (err) {
        console.error(`Error at submission: ${err}`);
        alert(`Sorry, unexpected error. Please try again later.`);
    }
}

async function submitLoginForm(e, form) {
    // 1. Prevent reloading page
    e.preventDefault();

    var returnError = false;

    // 2. Validate the form
    var uname = form.username;
    var upass = form.password;


    //Simple validation to make sure user entered something
    //If error found, add hightlight class to the text field
    if (uname.value == '') {
        uname.classList.add('error');
        returnError = true;
    } else uname.classList.remove('error');

    if (upass.value == '') {
        upass.classList.add('error');
        returnError = true;
    } else upass.classList.remove('error');

    // Highlight all error fields, then quit.
    if (returnError == true) {
        return false;
    }

    try {
        // 3. Submit the form
        // 3.1 User Interaction
        const btnSubmit = document.getElementById('login-submit');
        btnSubmit.disabled = true;
        setTimeout(() => btnSubmit.disabled = false, 2000);
        form.username.value = '';
        form.password.value = '';
        alert(`Username and/or Password didn't match`);
    }
    catch (err) {
        console.error(`Error at login: ${err}`);
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
        else if (pair[0] == 'subject')
            colKey = 'From Web: Subject';
        else if (pair[0] == 'othersubject')
            colKey = 'From Web: Subject';
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

const downloadForms = document.querySelectorAll(".download-form");
for (let i = 0; i < downloadForms.length; i++) {
    let downloadForm = downloadForms[i]
    if (downloadForm) {
        downloadForm.addEventListener("submit", function (e) {
            submitDownloadForm(e, this);
        });
    }
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        submitLoginForm(e, this);
    });
}
/*--/Event Listeners--*/
