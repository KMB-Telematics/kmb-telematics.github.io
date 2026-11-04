import FetchService from './service/FetchService.js';

const API_BASE = 'https://k0kivb28mf.execute-api.us-east-2.amazonaws.com';
const fetchService = new FetchService();

const REGEX_EMAIL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const REGEX_PHONE = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

// Field names the backend expects. Changing these changes the stored records.
// "othersubject" follows "subject" in the form, so it replaces "others" when present.
const API_FIELD_NAMES = {
    name: 'From Web: Name',
    email: 'From Web: Email',
    subject: 'From Web: Subject',
    othersubject: 'From Web: Subject',
    message: 'From Web: Message',
    company: 'From Web: Employer',
    jobtitle: 'From Web: Job Title',
    phone: 'From Web: Telephone',
};

const isBlank = (field) => field.value.trim() === '';
const isBadEmail = (field) => !REGEX_EMAIL.test(field.value.trim());

// Takes [field, isInvalid] pairs, highlights the invalid ones and reports whether all passed.
function validate(checks) {
    let allValid = true;
    for (const [field, isInvalid] of checks) {
        field.classList.toggle('error', isInvalid);
        if (isInvalid) allValid = false;
    }
    return allValid;
}

function buildJsonFormData(form) {
    const jsonFormData = {};
    for (const [name, value] of new FormData(form)) {
        const apiName = API_FIELD_NAMES[name];
        if (apiName) {
            jsonFormData[apiName] = value.trim();
        } else {
            console.error(`Error in building JSON: ${name} not found.`);
        }
    }
    return jsonFormData;
}

// Posts the form and returns true on success. On failure the user is told and
// their input is left in place so they can try again.
async function send(path, form, submitButton) {
    submitButton.disabled = true;
    try {
        const response = await fetchService.performPostHttpRequest(
            `${API_BASE}/${path}`,
            { 'Content-Type': 'application/json' },
            buildJsonFormData(form),
        );
        if (response !== 'OK') {
            throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
        }
        return true;
    } catch (err) {
        console.error(`Error at submission: ${err}`);
        alert('Sorry, unexpected error. Please try again later.');
        return false;
    } finally {
        submitButton.disabled = false;
    }
}

// Bootstrap removes a dismissed alert from the page, so keep a copy to show next time.
function createConfirmation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    const alertTemplate = container.querySelector('.alert').cloneNode(true);
    return {
        show() {
            container.replaceChildren(alertTemplate.cloneNode(true));
            container.style.display = 'block';
        },
        hide() {
            container.style.display = 'none';
        },
    };
}

function openDocument(src) {
    // Some browsers block pop-ups opened after a network request; open it in this tab instead.
    if (!window.open(src, '_blank')) {
        window.location.href = src;
    }
}

/*-- Contact form --*/
function updateOtherSubjectField(subject) {
    const container = document.getElementById('other-subject');
    container.innerHTML = subject.value === 'others'
        ? '<input type="text" class="form-control" name="othersubject" id="othersubject" placeholder="Please specify subject">'
        : '';
}

function initContactForm(form) {
    const confirmation = createConfirmation('contact-done');
    const subject = form.subject;
    subject.addEventListener('change', () => updateOtherSubjectField(subject));

    // Links can pre-select a subject, e.g. /contact.html?subject=Price%20and%20quotation
    const requested = new URLSearchParams(window.location.search).get('subject');
    const isRealSubject = [...subject.options].some((o) => o.value === requested && o.value !== 'default');
    if (isRealSubject) {
        subject.value = requested;
        updateOtherSubjectField(subject);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        confirmation.hide();

        const checks = [
            [form.name, isBlank(form.name)],
            [form.email, isBadEmail(form.email)],
            [subject, subject.value === 'default'],
            [form.message, isBlank(form.message)],
        ];
        if (subject.value === 'others') {
            checks.push([form.othersubject, isBlank(form.othersubject)]);
        }
        if (!validate(checks)) return;

        if (await send('contact', form, document.getElementById('contact-submit'))) {
            form.reset();
            updateOtherSubjectField(subject);
            confirmation.show();
        }
    });
}
/*-- /Contact form --*/

/*-- Newsletter form (in the footer of every page) --*/
function initSubscribeForm(form) {
    const confirmation = createConfirmation('subscribe-done');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        confirmation.hide();

        if (!validate([[form.email, isBadEmail(form.email)]])) return;

        if (await send('subscribe', form, document.getElementById('subscribe-submit'))) {
            form.reset();
            confirmation.show();
        }
    });
}
/*-- /Newsletter form --*/

/*-- Brochure download forms --*/
function initDownloadForm(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const valid = validate([
            [form.name, isBlank(form.name)],
            [form.email, isBadEmail(form.email)],
            [form.phone, !isBlank(form.phone) && !REGEX_PHONE.test(form.phone.value.trim())],
        ]);
        if (!valid) return;

        if (await send('download', form, form.elements.submit)) {
            form.reset();
            $('.modal').modal('hide');
            openDocument(form.dataset.src);
        }
    });
}
/*-- /Brochure download forms --*/

/*-- Placeholder login: nothing is sent anywhere until SSO is decided --*/
function initLoginForm(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const valid = validate([
            [form.username, isBlank(form.username)],
            [form.password, isBlank(form.password)],
        ]);
        if (!valid) return;

        form.reset();
        alert(`Username and/or Password didn't match`);
    });
}
/*-- /Placeholder login --*/

const contactForm = document.querySelector('#contact-form');
if (contactForm) initContactForm(contactForm);

const subscribeForm = document.querySelector('#subscribe-form');
if (subscribeForm) initSubscribeForm(subscribeForm);

document.querySelectorAll('.download-form').forEach(initDownloadForm);

const loginForm = document.querySelector('#login-form');
if (loginForm) initLoginForm(loginForm);
