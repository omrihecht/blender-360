// JavaScript Document

function ThreeHandler(){

	var camera, scene, renderer;
	var plane1 , plane2;	
	var clock = new THREE.Clock();
	var projector = new THREE.Projector();	
	var movementMult;
	var texture_placeholder,
	isUserInteracting = false,
	onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = 90, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0,
	target = new THREE.Vector3( 0 , 0 , 0 );	
	var deerAnim;
	var clickPoint = { x:0 , y:0 };
	var targetList = [];
	var mobilePos = { alpha:0 , beta:0 }


	this.setPanorama = function(){
		movementMult = (isMobile) ? 0.4 : 0.1;
		// setting up the renderer

		camera = new THREE.PerspectiveCamera( 75 , window.innerWidth / window.innerHeight , 1 , 1100 );
		//camera.position.z = 250;
		scene = new THREE.Scene();

		var cube_materials = [
			loadTexture( templateUrl + '/images/homepage/wall0.png' ), // right
			loadTexture( templateUrl + '/images/homepage/wall1.png' ), // left
			loadTexture( templateUrl + '/images/homepage/wall2.png' ), // top
			loadTexture( templateUrl + '/images/homepage/wall3.png' ), // bottom
			loadTexture( templateUrl + '/images/homepage/wall4.png' ), // back
			loadTexture( templateUrl + '/images/homepage/wall5.png' )  // front
		];

		var cube = new THREE.Mesh( new THREE.BoxGeometry( 1024, 1024, 1024, 7, 7, 7 ), new THREE.MeshFaceMaterial( cube_materials ) );
		cube.scale.x = - 1;
		
		var geometry_plane1 = new THREE.PlaneGeometry( 157 , 37 , 1 , 1 );
		var material_plane1 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( templateUrl + '/images/homepage/plane1_texture.png' ) , overdraw: true } )
		material_plane1.transparent = true;
		plane1 = new THREE.Mesh( geometry_plane1, material_plane1 );
		plane1.position.x = -30;
		plane1.position.y = 90;
		plane1.position.z = 511;
		plane1.scale.x = - 1;
		
		var geometry_plane2 = new THREE.PlaneGeometry( 223 , 234 , 1 , 1 );
		var deerTexture = new THREE.ImageUtils.loadTexture( templateUrl + '/images/homepage/plane2_texture.png' );
		deerAnim = new TextureAnimator( deerTexture, 10, 2, 20, 40 ); // texture, #horiz, #vert, #total, duration.
		var material_plane2 = new THREE.MeshBasicMaterial( { map: deerTexture , overdraw: true } );
		material_plane2.transparent = true;
		plane2 = new THREE.Mesh( geometry_plane2, material_plane2 );
		plane2.position.x = 30;
		plane2.position.y = 80;
		plane2.position.z = -511;		
		
		scene.add( cube );
		scene.add( plane1 );
		scene.add( plane2 );
		
		targetList.push( plane1 , plane2 );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth , window.innerHeight);
		
		document.getElementById('three-holder').appendChild( renderer.domElement );
		
		if(isMobile){
			document.getElementById('three-holder').addEventListener("touchstart", onDocumentMouseDown, false);
			document.getElementById('three-holder').addEventListener("touchmove", onDocumentMouseMove, false);
			document.getElementById('three-holder').addEventListener("touchend", onDocumentMouseUp, false);
			//window.addEventListener("devicemotion", onDeviceMotion , false);
			window.addEventListener('deviceorientation', onDeviceOrientation , false);	
		}else{
			document.getElementById('three-holder').addEventListener("mousedown", onDocumentMouseDown, false);
			document.getElementById('three-holder').addEventListener("mousemove", onDocumentMouseMove, false);
			document.getElementById('three-holder').addEventListener("mouseup", onDocumentMouseUp, false);				
		}
		
		animate();
	}

	function loadTexture( path ) {

		var texture = new THREE.Texture( texture_placeholder );
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

		var image = new Image();
		image.onload = function () {
			texture.image = this;
			texture.needsUpdate = true;
		};
		image.src = path;
		return material;
	}
	
	function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){	
		this.tilesHorizontal = tilesHoriz;
		this.tilesVertical = tilesVert;
		this.numberOfTiles = numTiles;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
		this.tileDisplayDuration = tileDispDuration;
		this.currentDisplayTime = 0;
		this.currentTile = 0;
			
		this.update = function( milliSec ){
			this.currentDisplayTime += milliSec;
			while (this.currentDisplayTime > this.tileDisplayDuration)
			{
				this.currentDisplayTime -= this.tileDisplayDuration;
				this.currentTile++;
				if (this.currentTile == this.numberOfTiles)
					this.currentTile = 0;
				var currentColumn = this.currentTile % this.tilesHorizontal;
				texture.offset.x = currentColumn / this.tilesHorizontal;
				var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
				texture.offset.y = currentRow / this.tilesVertical;
			}
		};
	}		
		

	function animate() {

		requestAnimationFrame( animate );
		update();

	}

	function update() {
		var delta = clock.getDelta(); 
		
		if ( isUserInteracting === false ) {
			//lon += 0.4;
		}
		
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );
		
		target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		target.y = 500 * Math.cos( phi );
		target.z = 500 * Math.sin( phi ) * Math.sin( theta );
		
		deerAnim.update(1000 * delta);
		
		camera.lookAt( target );
		renderer.render( scene, camera );

	}


	function onDocumentMouseDown( event ) {
		$('#tracer').html('mouse down');
		
		event.preventDefault();

		isUserInteracting = true;

		if(isMobile){
			var touch = event.touches[0];
			onPointerDownPointerX = touch.pageX;
			onPointerDownPointerY = touch.pageY;	
			console.log(touch.pageX);
		}else{
			onPointerDownPointerX = event.clientX;
			onPointerDownPointerY = event.clientY;
		}

		onPointerDownLon = lon;
		onPointerDownLat = lat;
		
		
		clickPoint.x = ( onPointerDownPointerX / window.innerWidth ) * 2 - 1;
		clickPoint.y = - ( onPointerDownPointerY / window.innerHeight ) * 2 + 1;		
		
		var vector = new THREE.Vector3( clickPoint.x , clickPoint.y , 1 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = ray.intersectObjects( targetList );
		if ( intersects.length > 0 )
		{
			//alert('click');
			console.log("Hit @ " + toString( intersects[0].point ) );
		}		
		
	}

	function onDocumentMouseMove( event ) {
		$('#tracer').html('mouse move \n');
		if ( isUserInteracting === true ) {
			
			if(isMobile){
				var touch = event.touches[0];
				clientX = touch.pageX;
				clientY = touch.pageY;	
				console.log(touch.pageX);
			}else{
				clientX = event.clientX;
				clientY = event.clientY;
			}			
			
			lon = ( onPointerDownPointerX - clientX ) * movementMult + onPointerDownLon;
			lat = ( clientY - onPointerDownPointerY ) * movementMult + onPointerDownLat;
			//console.log('lon :: ' + lon + ', lat :: ' + lat);
		}

	}

	function onDocumentMouseUp( event ) {
		$('#tracer').html('mouse up');
		isUserInteracting = false;
	}
	
	function onDeviceMotion( event ){
		var x = event.accelerationIncludingGravity.x;  
		var y = event.accelerationIncludingGravity.y;  
		var z = event.accelerationIncludingGravity.z; 
		$('#tracer').html('device motion' + '<br> x :: ' + x + '<br> y :: ' + y + '<br> z :: ' + z );	
	}
	
	function onDeviceOrientation(event){
		var alpha = event.alpha;
		var beta = event.beta;
		var gamma = event.gamma;
		mobilePos.alpha = alpha;
		mobilePos.beta - beta;
		if( isUserInteracting ) return;
		//lon = -alpha;
		//lat = Math.abs( beta ) - 90;
		//$('#tracer').html('device orientation' + '<br> alpha :: ' + alpha + '<br> beta :: ' + beta + '<br> gamma :: ' + gamma );		
	};	
	
	
	this.setPlanePosition = function( x , y , z ){
		plane1.position.x = x;
		plane1.position.y = y;
		plane1.position.z = z;
	}		
	
	this.stageResize = function(){
		var docH = window.innerHeight;
		var docW = window.innerWidth;
		
		var pageH = $('body').hasClass('admin-bar') ? docH - 92 : docH - 60;
		$('#three-holder').css({ 'height' : '30px' });
		
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();		
		renderer.setSize(docW , pageH);
	};
	
	
}