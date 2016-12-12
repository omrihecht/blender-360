// JavaScript Document
var docW, docH;
var isMobile, isIpad, isIOS, isAndroid;
var isIE;
var isOldBrowser;
var formH;


$(document).ready(function(e) {
	head.ready(function () {
		var md = new MobileDetect(window.navigator.userAgent);
		if(md.tablet() != null){
			isIpad = true;
			$('html').addClass('ipad_device');
		}
		if(md.phone() != null){
			isMobile = true;
			$('html').addClass('mobile_device');
			if(md.os() == 'AndroidOS'){
				isAndroid = true;
				$('html').addClass('AndroidOS');
			}
			if(md.os() == 'iOS'){
				isIOS = true;
				$('html').addClass('IOS');
			}			
		}
		if(head.browser.name == 'ie') isIE = true;
		if(head.browser.name == 'ie' && head.browser.version < 10){
			isOldBrowser = true;
			if (!window.console) {window.console = {};}
			if (!console.log) {console.log = function() {};}	
		} else {
			if(!isIpad && !isMobile){
				$('html').addClass('notOldBrowser');
			}
		}
		
		initClasses();

	});    
});

function initClasses(){
	var gridH = new GridHandler();
	gridH.setGrid();
	
	if( $('body').hasClass('home') ){
		var homepageH = new HomepageHandler();
		homepageH.setHomepage();
	}
	if( $('body').hasClass('lets-talk') ){
		formH = new FormHandler();
		formH.setForm();
	}
	if( $('body').hasClass('done-that') ){
		var portfolioH = new PortfolioHandler();
		portfolioH.setPortfolio();
	}
}