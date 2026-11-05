// Common Header
class CommonHeader extends HTMLElement {
    connectedCallback() {
        var thispage = this.attributes.thispage.value;
        var contentText = `
        <header>
            <div class="navbar navbar-default navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <button aria-label="Toggle navigation menu" class="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse"
                            type="button">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
        `;
        if (thispage == 'home') {
            contentText += `
            <a class="navbar-brand" href="/index.html"><img alt="logo" src="/assets/img/brand/kmb_logo_large.png"
                                class="logo-large"></a>
            `;
        } else {
            contentText += `
            <a class="navbar-brand" href="/index.html"><img src="/assets/img/brand/kmb_logo.png" alt="logo"
								class="logo-small"></a>
            `;
        }
        contentText += `
                    </div>

                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav">
        `;
        if (thispage == 'home') {
            contentText += `
                            <li class="active"><a href="/index.html">Home</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/index.html">Home</a></li>
            `;
        }
        if (thispage == 'technology') {
            contentText += `
                            <li class="active"><a href="/technology.html">Technology</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/technology.html">Technology</a></li>
            `;
        }
        if (thispage == 'applications') {
            contentText += `
                            <li class="active"><a href="/applications.html">Applications</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/applications.html">Applications</a></li>
            `;
        }
        if (thispage == 'products') {
            contentText += `
                            <li class="active"><a href="/products.html">Products</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/products.html">Products</a></li>
            `;
        }
        if (thispage == 'resources') {
            contentText += `
                            <li class="active"><a href="/resources.html">Resources</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/resources.html">Resources</a></li>
            `;
        }
        if (thispage == 'contact') {
            contentText += `
                            <li class="active"><a href="/contact.html">Contact</a></li>
            `;
        } else {
            contentText += `
                            <li><a href="/contact.html">Contact</a></li>
            `;
        }
        contentText += `
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        `;
        this.innerHTML = contentText;;
    }
}
customElements.define('common-header', CommonHeader);
// /Common Header

// Inner Header
class InnerHeader extends HTMLElement {
    connectedCallback() {
        var pagename = this.attributes.pagename.value;
        this.innerHTML = `
        <section id="inner-headline">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<h1 class="pageTitle">` + pagename + `</h1>
					</div>
				</div>
			</div>
		</section>
        `;
    }
}
customElements.define('inner-header', InnerHeader);
// /Inner Header

// Scroll UP
class ScrollUp extends HTMLElement {
    connectedCallback() {
        this.setAttribute('role', 'navigation');
        this.setAttribute('aria-label', 'Page');
        this.innerHTML = `<a href="#" aria-label="Back to top" class="scrollup"><i class="fa-solid fa-angle-up active"></i></a>`;
    }
}
customElements.define('scroll-up', ScrollUp);
// /Scroll Up

// Common Footer
class CommonFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-lg-3">
                        <div class="widget">
                            <h2 class="widgetheading footer-heading">Contact Us</h2>
                            <address>
                                <strong>KMB Telematics Inc.</strong><br>
                                <a href="https://maps.app.goo.gl/GHTCi8s6nvZasX9m6" target="_blank">1601 Connecticut Ave NW, Suite 301<br>
                                Washington DC 20009</a>
                            </address>
                            <p>
                                <i class="icon-phone"></i>
                                <a href="#" aria-label="Call KMB Telematics" class="cryptedphone" data-telarea="703" data-telnumber="783"
                                    data-telext="3377"
                                    onclick="window.location.href = 'tel:' + this.dataset.telarea + '-' + this.dataset.telnumber + '-' + this.dataset.telext; return false;"></a></a><br>
                                <i class="icon-envelope-alt"></i>
                                <a href="#" aria-label="Email KMB Telematics" class="cryptedmail" data-emailname="info" data-emaildomain="kmb"
                                    data-emailtld="ac"
                                    onclick="window.location.href = 'mailto:' + this.dataset.emailname + '@' + this.dataset.emaildomain + '.' + this.dataset.emailtld; return false;"></a>
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="widget">
                            <h2 class="widgetheading footer-heading">Quick Links</h2>
                            <ul class="link-list">
                                <li><a href="https://www.linkedin.com/company/kmb-telematics-inc/" target="_blank">Latest Updates</a></li>
                                <li><a href="/subpages/terms-and-conditions.html">Terms and Conditions</a></li>
                                <li><a href="/subpages/privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="/subpages/cookie-policy.html">Cookie Policy</a></li>
                                <li><a href="/contact.html">Careers</a></li>
                                <li><a href="/contact.html">Contact Us</a></li>
                            </ul>
                        </div>

                    </div>
                    <div class="col-lg-3">

                    </div>
                    <div class="col-lg-3">
                        <h2 class="widgetheading footer-heading">Get KMB updates</h2>
                        <div id="subscribe-done" style="display: none">
                            <div class="alert alert-success">
                                <button type="button" class="close" data-dismiss="alert">×</button>
                                You have been subscribed successfully. Thank you!
                            </div>
                        </div>
                        <div class="subscribes">
                            <form id="subscribe-form" class="subscribe">
                                <div class="form-group has-feedback">
                                    <input type="email" class="form-control" name="email" placeholder="Your email">
                                </div>
                                <p class="form-privacy">See our <a href="/subpages/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.</p>
                                <input type="submit" value="Subscribe" id="subscribe-submit" class="submit btn btn-default">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="sub-footer">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="copyright">
                                <p>
                                    <span>&copy; 2018 - 2027 KMB Telematics Inc. All rights reserved. </span>
                                </p>
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <ul class="social-network">
                                <li><a href="https://x.com/KmbTelematics" aria-label="KMB Telematics on X" data-placement="top" title="Twitter"
                                        target="_blank"><i class="fa-brands fa-x-twitter"></i></a></li>
                                <li><a href="https://www.linkedin.com/company/kmb-telematics-inc/" aria-label="KMB Telematics on LinkedIn" data-placement="top"
                                        title="Linkedin" target="_blank"><i class="fa-brands fa-linkedin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}
customElements.define('common-footer', CommonFooter);
// /Common Footer

// Common Download Form
class CommonDownloadForm extends HTMLElement {
    connectedCallback() {
        var thisitem = this.attributes.thisitem.value;
        var src = this.attributes.src.value;
        var contentText = `
            <div id="brochure-` + thisitem + `">
            <!-- Modal -->
            <div class="modal fade" id="popupModal-` + thisitem + `" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">×</button>
                            <h2 class="modal-heading">Download Brochure</h2>
                            <h3 class="modal-subheading">Please fill in the details below to download the requested materials:</h3>
                        </div>
                        <div class="modal-body">
                            <div class="column">
                                <form id="download-form-` + thisitem + `" class="download-form" data-src="` + src + `">
                                    <div class="form-group has-feedback">
                                        <label for="name-` + thisitem + `">Name*</label>
                                        <input type="text" class="form-control" id="name-` + thisitem + `" name="name" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="email-` + thisitem + `">E-mail*</label>
                                        <input type="email" class="form-control" id="email-` + thisitem + `" name="email" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="company-` + thisitem + `">Company</label>
                                        <input type="text" class="form-control" id="company-` + thisitem + `" name="company" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="jobtitle-` + thisitem + `">Job Title</label>
                                        <input type="text" class="form-control" id="jobtitle-` + thisitem + `" name="jobtitle" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="phone-` + thisitem + `">Phone</label>
                                        <input type="text" class="form-control" id="phone-` + thisitem + `" name="phone" placeholder="">
                                    </div>
                                    <p class="form-privacy">We use your details to provide the brochure and follow up on your interest. See our <a href="/subpages/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.</p>
                                    <input type="submit" name="submit" value="Download"
                                        class="submit btn btn-default">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        this.innerHTML = contentText;
    }
}
customElements.define('common-download-form', CommonDownloadForm);
// /Common Download Form


// Common carousal control
$('.carousel').carousel({
    interval: 5000,
    pause: "hover",
});

// Blog Address
class BlogAddress extends HTMLElement {
    connectedCallback() {
        var parentpage = this.attributes.parentpage.value;
        var thispage = document.getElementById("blog-header").textContent;
        var pagename = '';
        var pageaddress = '';
        if (parentpage == 'applications') {
            pagename = 'Applications';
            pageaddress = '/applications.html';
        } else if (parentpage == 'products') {
            pagename = 'Products';
            pageaddress = '/products.html';
        };
        var contentText = `
            <a href="/index.html">Home</a> &nbsp;&nbsp;>&nbsp;&nbsp; <a href="` + pageaddress + `"> ` + pagename + `</a> &nbsp;&nbsp;>&nbsp;&nbsp; ` + thispage;
        this.innerHTML = contentText;
    }
}
customElements.define('blog-address', BlogAddress);
// /Blog Address