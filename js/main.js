// Common Header
class CommonHeader extends HTMLElement {
    connectedCallback() {
        var thispage = this.attributes.thispage.value;
        var contentText = `
        <header>
            <div class="navbar navbar-default navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <button class="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse"
                            type="button">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
        `;
        if (thispage == 'home') {
            contentText += `
            <a class="navbar-brand" href="/index.html"><img alt="logo" src="/img/kmb_logo_large.png"
                                class="logo-large"></a>
            `;
        } else {
            contentText += `
            <a class="navbar-brand" href="/index.html"><img src="/img/kmb_logo.png" alt="logo"
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
						<h2 class="pageTitle">` + pagename + `</h2>
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
        this.innerHTML = `<a href="#" class="scrollup"><i class="fa fa-angle-up active"></i></a>`;
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
                            <h5 class="widgetheading">Our Contact</h5>
                            <address>
                                <strong>KMB Telematics Inc.</strong><br>
                                2111 Wilson Blvd., Suite 700<br>
                                Arlington, VA 22201
                            </address>
                            <p>
                                <i class="icon-phone"></i>
                                <a href="#" class="cryptedphone" data-telarea="703" data-telnumber="783"
                                    data-telext="3377"
                                    onclick="window.location.href = 'tel:' + this.dataset.telarea + '-' + this.dataset.telnumber + '-' + this.dataset.telext; return false;"></a></a><br>
                                <i class="icon-envelope-alt"></i>
                                <a href="#" class="cryptedmail" data-emailname="info" data-emaildomain="kmb"
                                    data-emailtld="ac"
                                    onclick="window.location.href = 'mailto:' + this.dataset.emailname + '@' + this.dataset.emaildomain + '.' + this.dataset.emailtld; return false;"></a>
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="widget">
                            <h5 class="widgetheading">Quick Links</h5>
                            <ul class="link-list">
                                <li><a href="https://www.linkedin.com/company/kmb-telematics-inc/" target="_blank">Latest Updates</a></li>
                                <li><a href="/subpages/terms-and-conditions.html">Terms and Conditions</a></li>
                                <li><a href="/subpages/privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="/contact.html">Contact Us</a></li>
                            </ul>
                        </div>

                    </div>
                    <div class="col-lg-3">

                    </div>
                    <div class="col-lg-3">
                        <h5 class="widgetheading">Subscribe to our newsletter</h5>
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
                                    <span>&copy; KMB Telematics Inc. 2023 All rights reserved. </span>
                                </p>
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <ul class="social-network">
                                <li><a href="https://twitter.com/KmbTelematics" data-placement="top" title="Twitter"
                                        target="_blank"><i class="fa fa-twitter"></i></a></li>
                                <li><a href="https://www.linkedin.com/company/kmb-telematics-inc/" data-placement="top"
                                        title="Linkedin" target="_blank"><i class="fa fa-linkedin"></i></a></li>
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
                            <h1>Download Brochure </h1>
                            <h2>Please fill in the details below to download the requested materials:</h2>
                        </div>
                        <div class="modal-body">
                            <div class="column">
                                <form id="download-form-` + thisitem + `" class="download-form">
                                    <div class="form-group has-feedback">
                                        <label for="name">Name*</label>
                                        <input type="text" class="form-control" name="name" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="email">E-mail*</label>
                                        <input type="email" class="form-control" name="email" placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="company">Company</label>
                                        <input type="company" class="form-control" name="company"
                                            placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="jobtitle">Job Title</label>
                                        <input type="jobTItle" class="form-control" name="jobtitle"
                                            placeholder="">
                                    </div>
                                    <div class="form-group has-feedback">
                                        <label for="phone">Phone</label>
                                        <input type="text" class="form-control" name="phone" placeholder="">
                                    </div>
                                    <input type="submit" name="submit" value="Download"
                                        class="submit btn btn-default">
                                    <!-- Fake Link -->
                                    <button type="button" name="hidden-button" hidden
                                        onclick="window.open('` + src + `', '_blank')">hidden download link ` + thisitem + `</button>
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
        };
        var contentText = `
            <a href="/index.html">Home</a> &nbsp;&nbsp;>&nbsp;&nbsp; <a href="` + pageaddress + `"> ` + pagename + `</a> &nbsp;&nbsp;>&nbsp;&nbsp; ` + thispage;
        this.innerHTML = contentText;
    }
}
customElements.define('blog-address', BlogAddress);
// /Blog Address