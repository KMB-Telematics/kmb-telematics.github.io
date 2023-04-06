class CommonHeader extends HTMLElement {
    connectedCallback() {
        var thispage = this.attributes.thispage.value
        var headerText = `
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
        `
        if (thispage == 'home') {
            headerText += `
            <a class="navbar-brand" href="/index.html"><img alt="logo" src="/img/kmb_logo_large.png"
                                style="height:400%"></a>
            `
        } else {
            headerText += `
            <a class="navbar-brand" href="/index.html"><img src="/img/kmb_logo.svg" alt="logo"
								style="height:200%"></a>
            `
        }
        headerText += `
                    </div>

                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav">
        `
        if (thispage == 'home') {
            headerText += `
                            <li class="active"><a href="/index.html">Home</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/index.html">Home</a></li>
            `
        }
        if (thispage == 'technology') {
            headerText += `
                            <li class="active"><a href="/technology.html">Technology</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/technology.html">Technology</a></li>
            `
        }
        if (thispage == 'applications') {
            headerText += `
                            <li class="active"><a href="/applications.html">Applications</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/applications.html">Applications</a></li>
            `
        }
        if (thispage == 'products') {
            headerText += `
                            <li class="active"><a href="/products.html">Products</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/products.html">Products</a></li>
            `
        }
        if (thispage == 'resources') {
            headerText += `
                            <li class="active"><a href="/resources.html">Resources</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/resources.html">Resources</a></li>
            `
        }
        if (thispage == 'contact') {
            headerText += `
                            <li class="active"><a href="/contact.html">Contact</a></li>
            `
        } else {
            headerText += `
                            <li><a href="/contact.html">Contact</a></li>
            `
        }
        headerText += `
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        `
        this.innerHTML = headerText
    }
}
customElements.define('common-header', CommonHeader );

class InnerHeader extends HTMLElement {
    connectedCallback() {
        var pagename = this.attributes.pagename.value
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
        `
    }
}
customElements.define('inner-header', InnerHeader )

class ScrollUp extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<a href="#" class="scrollup"><i class="fa fa-angle-up active"></i></a>`
    }
}
customElements.define('scroll-up', ScrollUp )

class CommonFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-lg-3">
                        <div class="widget">
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

                    </div>
                    <div class="col-lg-3">

                    </div>
                    <div class="col-lg-3">
                        <strong>Subscribe to our newsletter</strong><br>
                        <div id="subscribe-done" style="display: none">
                            <div class="alert alert-success">
                                <button type="button" class="close" data-dismiss="alert">×</button>
                                You have been successfully subscribed. Thank you!
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
                                    <span>&copy; KMB Telematics Inc. 2023 All rights reserved. </span><a href="#"
                                        Swifty="_blank">Terms of Use</a>. <a href="#" Swifty="_blank">Privacy Policy</a>.
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
        `
    }
}
customElements.define('common-footer', CommonFooter )

// $(document).ready(function () {
//     $("#download-daa").click(function () {
//         $("#popupModalDAA").modal("hide");
//     });
// });