function createVertexBuffer(GL, data){
    var VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.vertices), GL.STATIC_DRAW);
    return VERTEX;
  }
  
  function createFacesBuffer(GL, data){
    var FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.faces), GL.STATIC_DRAW);
    return FACES;
  }
  
  function createColorBuffer(GL, data){
    var COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, COLORS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.colors), GL.STATIC_DRAW);
    return COLORS;
  }
  
  function main() {
    var CANVAS = document.getElementById("myCanvas");
  
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
  
    var drag = false;
    var x_prev = 0;
    var y_prev = 0;
  
    var dx = 0;
    var dy = 0;
  
    var alpha = 0;
    var theta = 0;
    var friction = 0.5;
  
    var mouseDown = function (e) {
      drag = true;
      x_prev = e.pageX;
      y_prev = e.pageY;
      
    };
  
    var mouseUP = function (e) {
      drag = false;
      
    };
  
  
    var mouseMove = function (e) {
      if (!drag) {
        return false;
      }
  
      dx = e.pageX - x_prev;
      dy = e.pageY - y_prev;
  
      x_prev = e.pageX;
      y_prev = e.pageY;
  
      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    };
  
    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUP, false);

    CANVAS.addEventListener("mousemove", mouseMove, false);
  
    var GL;
    try {
      GL = CANVAS.getContext("webgl", { antialias: true });
      var EXT = GL.getExtension("OES_element_index_uint");
    } catch (e) {
      alert("WebGL context cannot be initialized");
      return false;
    }
  
   
    var shader_vertex_source = `
            attribute vec3 position;
            attribute vec3 color;
        
            uniform mat4 PMatrix;
            uniform mat4 VMatrix;
            uniform mat4 MMatrix;
           
            varying vec3 vColor;
            void main(void) {
            gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
            vColor = color;
            }`;
  
    var shader_fragment_source = `
            precision mediump float;
            varying vec3 vColor;
            // uniform vec3 color;
            void main(void) {
            gl_FragColor = vec4(vColor, 1.);
           
            }`;
  
    var compile_shader = function (source, type, typeString) {
      var shader = GL.createShader(type);
      GL.shaderSource(shader, source);
      GL.compileShader(shader);
      if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
        return false;
      }
      return shader;
    };
  
    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    GL.linkProgram(SHADER_PROGRAM);
  
    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  
    var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //Projection
    var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model
  
    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);
    GL.useProgram(SHADER_PROGRAM);
  
    // COLOR
    var spheres = []; // Array to store sphere data
    var generateRandomSphere = function () {
        var x = Math.random() * 40-20; // Random x position between -10 and 10
        var z = Math.random() *60 -20 ; // Random z position between -10 and 10
        var y =10+Math.random() * 7; // Random y position between 3 and 10
        var color = [Math.random(), Math.random(), Math.random()]; // Random color
    
        var sphere = generateSphere(x,y,z, color[0], color[1], color[2], 0.5, 50);
        var vertexBuffer = createVertexBuffer(GL, sphere);
        var colorBuffer = createColorBuffer(GL, sphere);
        var facesBuffer = createFacesBuffer(GL, sphere);
    
        spheres.push({
            vertexBuffer: vertexBuffer,
            colorBuffer: colorBuffer,
            facesBuffer: facesBuffer,
            facesCount: sphere.faces.length,
            x: x,
            y: y,
            z: z
        });
    };

    for (var i = 0; i < 200; i++) {
        generateRandomSphere();
    }



    var warnaBadan = [238/255, 156/255, 167/255];
    var warnakaki =[255/255, 231/255, 235/255];
    var warnaKepala = [255/255, 221/255, 225/255];
    var warnaTelinga = [238/255, 156/255, 167/255];
    var warnaMata = [153/255, 76/255, 0/255];
    // 255/255, 255/255, 255/255
    // var < ...Color> = [R/255, G/255, B/255]
  
    //z,x,y
    var kaki1 = generateEllipticParaboloid(12,-0.3,-2.5, 0.8,0.5,warnakaki[0], warnakaki[1], warnakaki[2], 100);
    var kaki2 = generateEllipticParaboloid(12,-1.75,-2.5, 0.8,0.5,warnakaki[0], warnakaki[1], warnakaki[2], 100);

    var kaki3 = generateEllipticParaboloid(9,-0.3,-2.5, 0.8,0.5,warnakaki[0], warnakaki[1], warnakaki[2], 100);
    var kaki4 = generateEllipticParaboloid(9,-1.75,-2.5, 0.8,0.5,warnakaki[0], warnakaki[1], warnakaki[2], 100);

    var hidung = createEllipticCone(13.2,-1,0,1.1,0.6,1.1,warnaTelinga[0],warnaTelinga[1],warnaTelinga[2],100);
    var hidungAtas =generateEllipsoid(13.6, -1, 0, 0.65, 0.5, 0.1, warnaTelinga[0], warnaTelinga[1], warnaTelinga[2], 100);
    // Badan                 
    var badan1 = generateTubeM(9, 0, 1, warnaBadan[0], warnaBadan[1], warnaBadan[2], 1, 2, 2, 100);
    var badan2 = generateTubeM(10, 0, 1, warnaKepala[0], warnaKepala[1], warnaKepala[2], 1, 2, 2, 100);

    var badan3 = generateTubeM(11, 0, 1, warnaBadan[0], warnaBadan[1], warnaBadan[2], 1, 2, 2, 100);

    // var <   > = <function>( x, y, z, color r, color g, color b, ... , ...);
    
    // Kepala
    var kepala = generateSphere(12, 0, 1, warnaKepala[0], warnaKepala[1], warnaKepala[2], 2, 100)

    // Belakang
    var belakang = generateSphere(9, 0, 1, warnaKepala[0], warnaKepala[1], warnaKepala[2], -2, 100)

    // Telinga Kanan
    var telingaKanan = generateEllipsoid(12.5, 1.2, 1.85, 0.7, 1.3, 0.7, warnaTelinga[0], warnaTelinga[1], warnaTelinga[2], 100)

    // Telinga Kiri
    var telingaKiri = generateEllipsoid(12.5, 1.2, 0.1, 0.7, 1.3, 0.7, warnaTelinga[0], warnaTelinga[1], warnaTelinga[2], 100)

    // Mata Satu //zyx
    var mataSatu = generateEllipsoid(13.8, 0.5, 0.4, 0.2,0.2,0.2,warnaMata[0], warnaMata[1], warnaMata[2], 100)

    // Mata Dua
    var mataDua = generateEllipsoid(13.8,0.5,1.6,0.2,0.2,0.2, warnaMata[0], warnaMata[1], warnaMata[2],  100)
    
    var platform = generateEllipsoid(3.5, 0, 0, 0.1, 50, 50, 65/255, 160/255, 55/255, 100);
    var platform2 = generateEllipsoid(3.3, 0, 0, 0.01, 20, 20, 210/255, 148/255, 65/255, 100);
    var platform3 = generateEllipsoid(3.4, 0, 0, 0.01, 25, 25, 60/255, 30/255, 1/255, 100);
    var bush1 = generateEllipsoid(2, -18.5, 6, 4, 2, 2, 50/255, 135/255, 1/255, 100);
    var bush2 = generateEllipsoid(2, 18.5, 6, 4, 2, 2, 50/255, 135/255, 1/255, 100);
    var bush3 = generateEllipsoid(3, -16.5, 5, 2, 1.5, 1.5, 50/255, 155/255, 1/255, 100);
    var bush4 = generateEllipsoid(3, 16.5, 5, 2, 1.5, 1.5, 50/255, 155/255, 1/255, 100);
    var torush = generateTorus(0, 0, 0, 255/255, 195/255, 135/255, 20, 5, 100, 100, 0, 0, 0);
    var stage = generateHalfSphere(0, 0, -0.3, 220/255, 170/255, 255/255, 20, 100);
    var cloud = generateCloud(8, 0, 0, 10, 0.5, 2, 0.5, 2, 20);

    var PLATFORM_VERTEX = createVertexBuffer(GL, platform);
    var PLATFORM_COLORS = createColorBuffer(GL, platform);
    var PLATFORM_FACES = createFacesBuffer(GL, platform);

    var PLATFORM2_VERTEX = createVertexBuffer(GL, platform2);
    var PLATFORM2_COLORS = createColorBuffer(GL, platform2);
    var PLATFORM2_FACES = createFacesBuffer(GL, platform2);

    var PLATFORM3_VERTEX = createVertexBuffer(GL, platform3);
    var PLATFORM3_COLORS = createColorBuffer(GL, platform3);
    var PLATFORM3_FACES = createFacesBuffer(GL, platform3);

    var BUSH1_VERTEX = createVertexBuffer(GL, bush1);
    var BUSH1_COLORS = createColorBuffer(GL, bush1);
    var BUSH1_FACES = createFacesBuffer(GL, bush1);

    var BUSH2_VERTEX = createVertexBuffer(GL, bush2);
    var BUSH2_COLORS = createColorBuffer(GL, bush2);
    var BUSH2_FACES = createFacesBuffer(GL, bush2);

    var BUSH3_VERTEX = createVertexBuffer(GL, bush3);
    var BUSH3_COLORS = createColorBuffer(GL, bush3);
    var BUSH3_FACES = createFacesBuffer(GL, bush3);

    var BUSH4_VERTEX = createVertexBuffer(GL, bush4);
    var BUSH4_COLORS = createColorBuffer(GL, bush4);
    var BUSH4_FACES = createFacesBuffer(GL, bush4);

    var TORUS_VERTEX = createVertexBuffer(GL, torush);
    var TORUS_COLORS = createColorBuffer(GL, torush);
    var TORUS_FACES = createFacesBuffer(GL, torush);

    var STAGE_VERTEX = createVertexBuffer(GL, stage);
    var STAGE_COLORS = createColorBuffer(GL, stage);
    var STAGE_FACES = createFacesBuffer(GL, stage);


    var CLOUD_VERTEX = createVertexBuffer(GL, cloud);
    var CLOUD_COLORS = createColorBuffer(GL,cloud);
    var CLOUD_FACES = createColorBuffer(GL,cloud);

    
    // Badan
    var BADAN1_VERTEX = createVertexBuffer(GL, badan1);
    var BADAN1_COLORS = createColorBuffer(GL, badan1);
    var BADAN1_FACES = createFacesBuffer(GL, badan1);
    var BADAN2_VERTEX = createVertexBuffer(GL, badan2);
    var BADAN2_COLORS = createColorBuffer(GL, badan2);
    var BADAN2_FACES = createFacesBuffer(GL, badan2);
    var BADAN3_VERTEX = createVertexBuffer(GL, badan3);
    var BADAN3_COLORS = createColorBuffer(GL, badan3);
    var BADAN3_FACES = createFacesBuffer(GL, badan3);

    // Kepala
    var KEPALA_VERTEX = createVertexBuffer(GL, kepala);
    var KEPALA_COLORS = createColorBuffer(GL, kepala);
    var KEPALA_FACES = createFacesBuffer(GL, kepala);

    // Belakang
    var BELAKANG_VERTEX = createVertexBuffer(GL, belakang);
    var BELAKANG_COLORS = createColorBuffer(GL, belakang);
    var BELAKANG_FACES = createFacesBuffer(GL, belakang);

    // Telinga Kanan
    var TELINGA_KANAN_VERTEX = createVertexBuffer(GL, telingaKanan);
    var TELINGA_KANAN_COLORS = createColorBuffer(GL, telingaKanan);
    var TELINGA_KANAN_FACES = createFacesBuffer(GL, telingaKanan);

    // Telinga Kiri
    var TELINGA_KIRI_VERTEX = createVertexBuffer(GL, telingaKiri);
    var TELINGA_KIRI_COLORS = createColorBuffer(GL, telingaKiri);
    var TELINGA_KIRI_FACES = createFacesBuffer(GL, telingaKiri);

    // Matu Satu
    var MATA_SATU_VERTEX = createVertexBuffer(GL, mataSatu);
    var MATA_SATU_COLORS = createColorBuffer(GL, mataSatu);
    var MATA_SATU_FACES = createFacesBuffer(GL, mataSatu);

    // Mata Dua
    var MATA_DUA_VERTEX = createVertexBuffer(GL, mataDua);
    var MATA_DUA_COLORS = createColorBuffer(GL, mataDua);
    var MATA_DUA_FACES = createFacesBuffer(GL, mataDua);

    //kaki
    var KAKI1_VERTEX = createVertexBuffer(GL, kaki1);
    var KAKI1_COLORS = createColorBuffer(GL, kaki1);
    var KAKI1_FACES = createFacesBuffer(GL, kaki1);
    var KAKI2_VERTEX = createVertexBuffer(GL, kaki2);
    var KAKI2_COLORS = createColorBuffer(GL, kaki2);
    var KAKI2_FACES = createFacesBuffer(GL, kaki2);
    var KAKI3_VERTEX = createVertexBuffer(GL, kaki3);
    var KAKI3_COLORS = createColorBuffer(GL, kaki3);
    var KAKI3_FACES = createFacesBuffer(GL, kaki3);
    var KAKI4_VERTEX = createVertexBuffer(GL, kaki4);
    var KAKI4_COLORS = createColorBuffer(GL, kaki4);
    var KAKI4_FACES = createFacesBuffer(GL, kaki4);

    //hidung
    var HIDUNG_VERTEX = createVertexBuffer(GL, hidung);
    var HIDUNG_COLORS = createColorBuffer(GL, hidung);
    var HIDUNG_FACES = createFacesBuffer(GL,hidung);
    
    var HIDUNGATAS_VERTEX = createVertexBuffer(GL, hidungAtas);
    var HIDUNGATAS_COLORS = createColorBuffer(GL, hidungAtas);
    var HIDUNGATAS_FACES = createFacesBuffer(GL,hidungAtas);

    


    // var <   >_VERTEX = createVertexBuffer(GL, <   >);
    // var <   >_COLORS = createColorBuffer(GL, <   >);
    // var <   >_FACES = createFacesBuffer(GL, <   >);
  
  
    // Matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    LIBS.translateZ(VIEW_MATRIX, -80);
  
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
  
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
  var time_prev=0;
  var time_start = Date.now();
  var maxTranslation = 1; // Maksimum jarak translasi dari pusat (dalam unit)
  var period = 2000; // Periode gerakan (dalam milidetik)
  var rotateKaki = 0;
  var rotateKakispeed = 0.1;
  var kakiRange;
  var kakiAngle;

    var animateKaki = function(time){
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
      
  
      var dt = time - time_prev;
      time_prev = time;
  
      if (!drag) {
        dx *= friction;
        dy *= friction;
  
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }

      rotateKaki += rotateKakispeed; //speed muter

      kakiRange = Math.PI / 16; //jarak geleng2

      kakiAngle = Math.sin(rotateKaki) * kakiRange; //sudut geleng2

      var currentTime = Date.now();
      var translateX = Math.sin(currentTime * 0.005 ) * 1;
  
     
            LIBS.translateX(MODEL_MATRIX, translateX);
            
      
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX, Math.PI / -2);   
        
        LIBS.translateX(MODEL_MATRIX, translateX);
        LIBS.rotateX(MODEL_MATRIX, -kakiAngle); 
        LIBS.rotateY(MODEL_MATRIX, theta);
        LIBS.rotateX(MODEL_MATRIX, alpha);
        
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI1_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI1_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI1_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kaki1.faces.length, GL.UNSIGNED_SHORT, 0);
    
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX, Math.PI / -2);
        LIBS.rotateX(MODEL_MATRIX, -kakiAngle); 
        LIBS.translateX(MODEL_MATRIX, translateX);
        LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI4_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI4_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI4_FACES);  
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kaki4.faces.length, GL.UNSIGNED_SHORT, 0);
    
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX, Math.PI / -2);
        LIBS.rotateX(MODEL_MATRIX, kakiAngle); 
        LIBS.translateX(MODEL_MATRIX, translateX);
        LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI2_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI2_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI2_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kaki2.faces.length, GL.UNSIGNED_SHORT, 0);
    
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MODEL_MATRIX, Math.PI / -2);
        LIBS.rotateX(MODEL_MATRIX, kakiAngle); 
        LIBS.translateX(MODEL_MATRIX, translateX);
        LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI3_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI3_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI3_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kaki3.faces.length, GL.UNSIGNED_SHORT, 0);
        
        GL.flush();
  
        window.requestAnimationFrame(animateKaki);
  
      
    }

    var translationX = 0; // Initial translation along the x-axis
var translationSpeed = 0.1; // Speed of translation
var animationDuration = 1000; // Duration of animation in milliseconds
var startTime = Date.now(); // Start time of animation

function animateEye() {
    // Calculate time elapsed since the start of the animation
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    
  
      if (!drag) {
        dx *= friction;
        dy *= friction;
  
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }
  
      

      var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;

    // Calculate the progress of the animation (0 to 1)
    var progress = elapsedTime / animationDuration;
    console.log(progress);
var currentTime = Date.now();
    var translateX = Math.sin(currentTime * 0.005 ) * 1;

    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
        // Update translation based on progress
        // translationX = progress * translationSpeed;

        // Apply translation to the MODEL_MATRIX
        // LIBS.translate(MODEL_MATRIX, translationX, 0, 0);

        // Draw the "kepala" object
        GL.bindBuffer(GL.ARRAY_BUFFER, MATA_SATU_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, MATA_SATU_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_SATU_FACES);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, mataSatu.faces.length, GL.UNSIGNED_SHORT, 0);
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);

        GL.bindBuffer(GL.ARRAY_BUFFER, MATA_DUA_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, MATA_DUA_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_DUA_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, mataDua.faces.length, GL.UNSIGNED_SHORT, 0);

       
        // Request the next frame
        requestAnimationFrame(animateEye);
    
}

var minScale = 0.5
    var maxScale = 2;
    var time_prev = 0;
    var animate = function (time) {
      GL.viewport(0, 0, CANVAS.width, CANVAS.height);
      
  // Example rotation angle in radians
var angle = Math.PI *2; // 45 degrees

// Example arbitrary axis of rotation (normalized)
var axis = [1, 0, 1]; // Rotating around the diagonal axis [1, 1, 0]
      var dt = time - time_prev;
      time_prev = time;
  
      if (!drag) {
        dx *= friction;
        dy *= friction;
  
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }
  
      MODEL_MATRIX = LIBS.get_I4();
      LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
  

      spheres.forEach(function (sphereData) {
        var rotationSpeed = 0.003;
        var rotationIncrement = 0.01; // Adjust this value to control how much the object rotates in each frame

      angle += rotationSpeed * dt/10;
      var random = Math.random(minScale,maxScale);
      MODEL_MATRIX = LIBS.get_I4();
    //   LIBS.rotateArbitraryAxis(MODEL_MATRIX, angle, axis);
    // LIBS.scale2(MODEL_MATRIX,random);
      LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
        // Update sphere's position based on mouse movement
        

        GL.bindBuffer(GL.ARRAY_BUFFER, sphereData.vertexBuffer);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, sphereData.colorBuffer);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, sphereData.facesBuffer);

        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        GL.drawElements(GL.TRIANGLES, sphereData.facesCount, GL.UNSIGNED_SHORT, 0);

    });

   
    // BADAN
    var currentTime = Date.now();
    var translateX = Math.sin(currentTime * 0.005 ) * 1;

    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, badan1.faces.length, GL.UNSIGNED_SHORT, 0);

    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, badan2.faces.length, GL.UNSIGNED_SHORT, 0);

    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BADAN3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN3_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, badan3.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kepala
    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KEPALA_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kepala.faces.length, GL.UNSIGNED_SHORT, 0);


    //Belakang
    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, BELAKANG_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BELAKANG_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BELAKANG_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, belakang.faces.length, GL.UNSIGNED_SHORT, 0);

    //Telinga Kanan
    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA_KANAN_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA_KANAN_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA_KANAN_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telingaKanan.faces.length, GL.UNSIGNED_SHORT, 0);

    //Telinga Kiri
    MODEL_MATRIX = LIBS.get_I4();
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA_KIRI_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA_KIRI_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA_KIRI_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, telingaKiri.faces.length, GL.UNSIGNED_SHORT, 0);

    //Mata Satu
    // GL.bindBuffer(GL.ARRAY_BUFFER, MATA_SATU_VERTEX);
    // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    // GL.bindBuffer(GL.ARRAY_BUFFER, MATA_SATU_COLORS);
    // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_SATU_FACES);

    // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    // GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    // GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    // GL.drawElements(GL.TRIANGLES, mataSatu.faces.length, GL.UNSIGNED_SHORT, 0);

    // //Mata Dua
    // GL.bindBuffer(GL.ARRAY_BUFFER, MATA_DUA_VERTEX);
    // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    // GL.bindBuffer(GL.ARRAY_BUFFER, MATA_DUA_COLORS);
    // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_DUA_FACES);

    // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    // GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    // GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    // GL.drawElements(GL.TRIANGLES, mataDua.faces.length, GL.UNSIGNED_SHORT, 0);

    //kaki
    MODEL_MATRIX = LIBS.get_I4();
    
      
      LIBS.rotateX(MODEL_MATRIX, Math.PI/-2);
      
     
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNG_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNG_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HIDUNG_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    
    GL.drawElements(GL.TRIANGLES, hidung.faces.length, GL.UNSIGNED_SHORT, 0);

    
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateX(MODEL_MATRIX, Math.PI/-2);
          LIBS.translateX(MODEL_MATRIX, translateX);
          LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNGATAS_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNGATAS_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HIDUNGATAS_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    
    GL.drawElements(GL.TRIANGLES, hidungAtas.faces.length, GL.UNSIGNED_SHORT, 0);

    
    
//z(- blkng)x (- to kanan)y - kebawah
    var ekor = [
        // [-5, 0, 0],   // Control Point 1
        // [-5, 3, 0],   // Control Point 2
        [8,-1,0],   // Control Point 4
        [7, -2, -1],
        [7, 1, -1],
        [6,1,0], 
        [7,0,-1],  // Control Point 3
        [7,1,1],
        [7,-0.5,-0.5],
        [6.75,-0.25,-0.25],
        [6.75,-0.5,-0.5],
        [6.75,-0.4,-0.4],
        [6.5,-0.2,-0.4],
        [6.5,-0.1,-0.4],
        [6.5,0,-0.4],
        [6.25,0.2,-0.5],

    ];
    var alisKanan =[[13.7,-0.3,0.6],
    [13.7,0.2,1],
    [13.7,0.4,0.6],

    ];
    var alisKiri =[
        [13.7,-1.5,0.6],
    
     [13.7,-1.2,1], 
    [13.7,-1,0.6]
    

    ];
    drawBezierCurve(GL, SHADER_PROGRAM, ekor, 100);
    drawBezierCurve(GL,SHADER_PROGRAM,alisKanan,100);
    drawBezierCurve(GL,SHADER_PROGRAM,alisKiri,100);

    rotateKaki += rotateKakispeed; //speed muter
    kakiRange = Math.PI ; //jarak geleng2
    kakiAngle = Math.sin(rotateKaki/8) * kakiRange;

    var minScale = 0.5;
    var maxScale = 2;
    var scaleFactor = Math.sin(time * 0.005) * (maxScale - minScale) / 2 + (maxScale + minScale) / 2;
    
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(MODEL_MATRIX, Math.PI / -2);
    // LIBS.scale(MODEL_MATRIX, scaleFactor, scaleFactor, scaleFactor);
    // LIBS.rotateY(MODEL_MATRIX,kakiAngle);
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PLATFORM_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, platform.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PLATFORM2_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, platform2.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PLATFORM3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PLATFORM3_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, platform3.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BUSH1_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bush1.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BUSH2_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bush2.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BUSH3_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bush3.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BUSH4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BUSH4_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bush4.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TORUS_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TORUS_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TORUS_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, torush.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, STAGE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, STAGE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, STAGE_FACES);
    GL.activeTexture(GL.TEXTURE0);
    
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, stage.faces.length, GL.UNSIGNED_SHORT, 0);
    
      CANVAS.addEventListener("mousedown", mouseDown, false);

  
      GL.flush();
  
      window.requestAnimationFrame(animate);
    };

    //GERI
      // COLOR
  var bodyColor = [0/255, 0/255, 0/255]
  var bottomColor = [255/255, 0/255, 0/255]
  var headColor = [245/255, 217/255, 181/255]
  var whiteColor = [255/255, 255/255, 255/255]
  var testColor = [150/255, 255/255, 255/255]


  // SHAPE
  var body = generateTubeP(0, 0, -0.5, bottomColor[0], bottomColor[1], bottomColor[2], 1.5, 3.1, 3, 100);
  var body2 = generateTubeP(0, 0, -0.1, bodyColor[0], bodyColor[1], bodyColor[2], 3.4, 3, 3, 100);
  var bottom = generateSphere(0, 0, -0.6, bottomColor[0], bottomColor[1], bottomColor[2], 3.1, 100);
  var head = generateSphere(0, 0, 3.4, bodyColor[0], bodyColor[1], bodyColor[2], 3, 100);
  var leftear = generateEllipsoid(2.5, 3, 3.3, 1.6, 1.6, 0.2, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var rightear = generateEllipsoid(-2.5, 3, 3.3, 1.6, 1.6, 0.2, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var lefteye = generateEllipsoid(-0.55, 0, 5.5, 0.4, 0.6, 1, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var righteye = generateEllipsoid(0.55, 0, 5.5, 0.4, 0.6, 1, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var nose = generateEllipticParaboloidg(0, -0.7, -6.4, 0.8, 0.6, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var tie = generateHyperboloidg(0, -3, 3.45, 0.2, 0.01, 0.4, whiteColor[0], whiteColor[1], whiteColor[2], 100);
  var tiedot = generateEllipsoid(0, -3, 3.45, 0.2, 0.2, 0.03, bottomColor[0], bottomColor[1], bottomColor[2], 100);
  var frightfoot = generateEllipsoid(2, -2.5, 3, 0.5, 0.8, 0.5, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var fleftfoot = generateEllipsoid(-2, -2.5, 3, 0.5, 0.8, 0.5, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var brightfoot = generateEllipsoid(2, -2.5, -0.9, 0.5, 0.8, 0.5, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var bleftfoot = generateEllipsoid(-2, -2.5, -0.9, 0.5, 0.8, 0.5, bodyColor[0], bodyColor[1], bodyColor[2], 100);
  var topeng1 = generateEllipsoid(-0.3, 0, 5.536, 1.5, 1.8, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var topeng2 = generateEllipsoid(-0.26, 0, 5.6, 1.4, 1.8, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var topeng3 = generateEllipsoid(0.3, 0, 5.536, 1.5, 1.8, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var topeng4 = generateEllipsoid(0.26, 0, 5.6, 1.4, 1.8, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var topeng5 = generateEllipsoid(0, 0, 5.65, 1.4, 1.2, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var pipikiri = generateEllipsoid(-0.7, -0.7, 5.3, 1.4, 1.2, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var pipikanan = generateEllipsoid(0.7, -0.7, 5.3, 1.4, 1.2, 0.8, headColor[0], headColor[1], headColor[2], 100);
  var pipitengah = generateEllipsoid(0, -0.9, 5.3, 2, 1.21, 0.8, headColor[0], headColor[1], headColor[2], 100);
  


  // var <   > = <function>( x, y, z, color r, color g, color b, ... , ...);


  // BODY
  var BODY_VERTEX = createVertexBuffer(GL, body);
  var BODY_COLORS = createColorBuffer(GL, body);
  var BODY_FACES = createFacesBuffer(GL, body);

  // BODY2
  var BODY2_VERTEX = createVertexBuffer(GL, body2);
  var BODY2_COLORS = createColorBuffer(GL, body2);
  var BODY2_FACES = createFacesBuffer(GL, body2);

  // BOTTOM
  var BOTTOM_VERTEX = createVertexBuffer(GL, bottom);
  var BOTTOM_COLORS = createColorBuffer(GL, bottom);
  var BOTTOM_FACES = createFacesBuffer(GL, bottom);

  // HEAD
  var HEAD_VERTEX = createVertexBuffer(GL, head);
  var HEAD_COLORS = createColorBuffer(GL, head);
  var HEAD_FACES = createFacesBuffer(GL, head);

  // LEFTEAR
  var LEFTEAR_VERTEX = createVertexBuffer(GL, leftear);
  var LEFTEAR_COLORS = createColorBuffer(GL, leftear);
  var LEFTEAR_FACES = createFacesBuffer(GL, leftear);

  // RIGHTEAR
  var RIGHTEAR_VERTEX = createVertexBuffer(GL, rightear);
  var RIGHTEAR_COLORS = createColorBuffer(GL, rightear);
  var RIGHTEAR_FACES = createFacesBuffer(GL, rightear);

  // LEFTEYE
  var LEFTEYE_VERTEX = createVertexBuffer(GL, lefteye);
  var LEFTEYE_COLORS = createColorBuffer(GL, lefteye);
  var LEFTEYE_FACES = createFacesBuffer(GL, lefteye);

  // RIGHTEYE
  var RIGHTEYE_VERTEX = createVertexBuffer(GL, righteye);
  var RIGHTEYE_COLORS = createColorBuffer(GL, righteye);
  var RIGHTEYE_FACES = createFacesBuffer(GL, righteye);

  // RIGHTEYE
  var NOSE_VERTEX = createVertexBuffer(GL, nose);
  var NOSE_COLORS = createColorBuffer(GL, nose);
  var NOSE_FACES = createFacesBuffer(GL, nose);

  // TIE
  var TIE_VERTEX = createVertexBuffer(GL, tie);
  var TIE_COLORS = createColorBuffer(GL, tie);
  var TIE_FACES = createFacesBuffer(GL, tie);

  // TIEDOT
  var TIEDOT_VERTEX = createVertexBuffer(GL, tiedot);
  var TIEDOT_COLORS = createColorBuffer(GL, tiedot);
  var TIEDOT_FACES = createFacesBuffer(GL, tiedot);

  // FRONT RIGHT FOOT
  var FRIGHTFOOT_VERTEX = createVertexBuffer(GL, frightfoot);
  var FRIGHTFOOT_COLORS = createColorBuffer(GL, frightfoot);
  var FRIGHTFOOT_FACES = createFacesBuffer(GL, frightfoot);

  // FRONT LEFT FOOT
  var FLEFTFOOT_VERTEX = createVertexBuffer(GL, fleftfoot);
  var FLEFTFOOT_COLORS = createColorBuffer(GL, fleftfoot);
  var FLEFTFOOT_FACES = createFacesBuffer(GL, fleftfoot);

  // BACK RIGHT FOOT
  var BRIGHTFOOT_VERTEX = createVertexBuffer(GL, brightfoot);
  var BRIGHTFOOT_COLORS = createColorBuffer(GL, brightfoot);
  var BRIGHTFOOT_FACES = createFacesBuffer(GL, brightfoot);

  // BACK LEFT FOOT
  var BLEFTFOOT_VERTEX = createVertexBuffer(GL, bleftfoot);
  var BLEFTFOOT_COLORS = createColorBuffer(GL, bleftfoot);
  var BLEFTFOOT_FACES = createFacesBuffer(GL, bleftfoot);

  // TOPENG1 FOOT
  var TOPENG1_VERTEX = createVertexBuffer(GL, topeng1);
  var TOPENG1_COLORS = createColorBuffer(GL, topeng1);
  var TOPENG1_FACES = createFacesBuffer(GL, topeng1);

  // TOPENG2 FOOT
  var TOPENG2_VERTEX = createVertexBuffer(GL, topeng2);
  var TOPENG2_COLORS = createColorBuffer(GL, topeng2);
  var TOPENG2_FACES = createFacesBuffer(GL, topeng2);

  // TOPENG3 FOOT
  var TOPENG3_VERTEX = createVertexBuffer(GL, topeng3);
  var TOPENG3_COLORS = createColorBuffer(GL, topeng3);
  var TOPENG3_FACES = createFacesBuffer(GL, topeng3);

  // TOPENG4 FOOT
  var TOPENG4_VERTEX = createVertexBuffer(GL, topeng4);
  var TOPENG4_COLORS = createColorBuffer(GL, topeng4);
  var TOPENG4_FACES = createFacesBuffer(GL, topeng4);

  // TOPENG5 FOOT
  var TOPENG5_VERTEX = createVertexBuffer(GL, topeng5);
  var TOPENG5_COLORS = createColorBuffer(GL, topeng5);
  var TOPENG5_FACES = createFacesBuffer(GL, topeng5);

  // PIPIKIRI
  var PIPIKIRI_VERTEX = createVertexBuffer(GL, pipikiri);
  var PIPIKIRI_COLORS = createColorBuffer(GL, pipikiri);
  var PIPIKIRI_FACES = createFacesBuffer(GL, pipikiri);

  // PIPIKANAN
  var PIPIKANAN_VERTEX = createVertexBuffer(GL, pipikanan);
  var PIPIKANAN_COLORS = createColorBuffer(GL, pipikanan);
  var PIPIKANAN_FACES = createFacesBuffer(GL, pipikanan);

  // PIPITENGAH
  var PIPITENGAH_VERTEX = createVertexBuffer(GL, pipitengah);
  var PIPITENGAH_COLORS = createColorBuffer(GL, pipitengah);
  var PIPITENGAH_FACES = createFacesBuffer(GL, pipitengah);


  // var <   >_VERTEX = createVertexBuffer(GL, <   >);
  // var <   >_COLORS = createColorBuffer(GL, <   >);
  // var <   >_FACES = createFacesBuffer(GL, <   >);


  // Matrix
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();
  LIBS.translateZ(VIEW_MATRIX, -70);

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var time_prev = 0;
  var bodyRotates = 0;
  var bodySpeed = 0.05
  var bodyRange;
  var bodyAngle;

  var animateg = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    var dt = time - time_prev;
    time_prev = time;

    
    if (!drag) {
      dx *= friction;
      dy *= friction;

      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
    //--MOVING--//

    bodyRotates += bodySpeed; //speed muter

    bodyRange = Math.PI/64; //jarak geleng2
    
    bodyAngle = Math.sin(bodyRotates)*bodyRange; //sudut geleng2
    
    
    
    LIBS.rotateX(MODEL_MATRIX, bodyAngle); //buat muter
    
    // MODEL_MATRIX = LIBS.get_I4();

    


    // BODY
    GL.bindBuffer(GL.ARRAY_BUFFER, BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BODY_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, body.faces.length, GL.UNSIGNED_SHORT, 0);

    // BODY2
    GL.bindBuffer(GL.ARRAY_BUFFER, BODY2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BODY2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BODY2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, body2.faces.length, GL.UNSIGNED_SHORT, 0);


    // BOTTOM
    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bottom.faces.length, GL.UNSIGNED_SHORT, 0);

    // HEAD
    GL.bindBuffer(GL.ARRAY_BUFFER, HEAD_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HEAD_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HEAD_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, head.faces.length, GL.UNSIGNED_SHORT, 0);

    // LEFTEAR
    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEAR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEAR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFTEAR_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, leftear.faces.length, GL.UNSIGNED_SHORT, 0);

    // RIGHTEAR
    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEAR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEAR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHTEAR_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, rightear.faces.length, GL.UNSIGNED_SHORT, 0);

    // LEFTEYE
    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEYE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEYE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFTEYE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, lefteye.faces.length, GL.UNSIGNED_SHORT, 0);

    // RIGHTEYE
    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEYE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEYE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHTEYE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, righteye.faces.length, GL.UNSIGNED_SHORT, 0);

    // NOSE
    GL.bindBuffer(GL.ARRAY_BUFFER, NOSE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, NOSE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, NOSE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, nose.faces.length, GL.UNSIGNED_SHORT, 0);

    // TIE
    GL.bindBuffer(GL.ARRAY_BUFFER, TIE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TIE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, tie.faces.length, GL.UNSIGNED_SHORT, 0);

    // TIEDOT
    GL.bindBuffer(GL.ARRAY_BUFFER, TIEDOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TIEDOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIEDOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, tiedot.faces.length, GL.UNSIGNED_SHORT, 0);



    // FRONT LEFT FOOT
    GL.bindBuffer(GL.ARRAY_BUFFER, FLEFTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, FLEFTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FLEFTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, fleftfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    // BACK RIGHT FOOT
    GL.bindBuffer(GL.ARRAY_BUFFER, BRIGHTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BRIGHTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BRIGHTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, brightfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    // BACK LEFT FOOT
    GL.bindBuffer(GL.ARRAY_BUFFER, BLEFTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BLEFTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BLEFTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bleftfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    var alis1 = [
    [-0.8, 0.95, 6.36],
    [-0.75, 1, 6.36],
    [-0.70, 1.05, 6.36],
    [-0.65, 1.1, 6.36],
    [-0.60, 1.15, 6.36],
    [-0.55, 1.2, 6.36],
    [-0.50, 1.15, 6.36],
    [-0.45, 1.1, 6.36],
    [-0.40, 1.05, 6.36],
    [-0.35, 1, 6.36],
    [-0.30, 0.95, 6.39],
  ];

  var alis2 = [
    [0.8, 0.95, 6.36],
    [0.75, 1, 6.36],
    [0.70, 1.05, 6.36],
    [0.65, 1.1, 6.36],
    [0.60, 1.15, 6.36],
    [0.55, 1.2, 6.36],
    [0.50, 1.15, 6.36],
    [0.45, 1.1, 6.36],
    [0.40, 1.05, 6.36],
    [0.35, 1, 6.36],
    [0.30, 0.95, 6.39],
  ];

  var mulut = [
    [-0.50, -0.5, 6.3],
    [-0.45, -0.76, 6.2],
    [-0.4, -0.76, 6.2],
    [-0.35, -0.77, 6.2],
    [-0.3, -0.78, 6.2],
    [-0.25, -0.79, 6.2],
    [-0.2, -0.8, 6.2],
    [-0.15, -0.81, 6.2],
    [0, -0.81, 6.2],
    [0.15, -0.81, 6.2],
    [0.2, -0.8, 6.2],
    [0.25, -0.79, 6.2],
    [0.30, -0.78, 6.2],
    [0.35, -0.77, 6.2],
    [0.40, -0.76, 6.2],
    [0.45, -0.75, 6.2],
    [0.50, -0.5, 6.3],
  ];
    
    drawBezierCurve(GL, SHADER_PROGRAM, alis1, 100);
    drawBezierCurve(GL, SHADER_PROGRAM, alis2, 100);
    drawBezierCurve(GL, SHADER_PROGRAM, mulut, 100);

    // TOPENG1
    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, topeng1.faces.length, GL.UNSIGNED_SHORT, 0);

    // TOPENG2
    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, topeng2.faces.length, GL.UNSIGNED_SHORT, 0);

    // TOPENG3
    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG3_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, topeng3.faces.length, GL.UNSIGNED_SHORT, 0);

    // TOPENG4
    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG4_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, topeng4.faces.length, GL.UNSIGNED_SHORT, 0);
    
    // TOPENG5
    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG5_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, topeng5.faces.length, GL.UNSIGNED_SHORT, 0);

    // PIPIKIRI
    GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKIRI_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKIRI_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPIKIRI_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, pipikiri.faces.length, GL.UNSIGNED_SHORT, 0);

    // PIPIKANAN
    GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKANAN_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKANAN_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPIKANAN_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, pipikanan.faces.length, GL.UNSIGNED_SHORT, 0);

    // PIPITENGAH
    GL.bindBuffer(GL.ARRAY_BUFFER, PIPITENGAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PIPITENGAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPITENGAH_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, pipitengah.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.flush();

    window.requestAnimationFrame(animateg);
  };

  var time_prev = 0;
  var footrotate = 0;
  var footrotatespeed = 0.05;
  var footrotateAngle;
  var footrotateRange;
  var footrotateduration = 5000;

  //KAKI KANAN DEPAN

  var animatefoot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
  
    var dt = time - time_prev;
    time_prev = time;
  
      
    if (!drag) {
      dx *= friction;
      dy *= friction;
  
      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }
  

    //--MOVING--//
  
    footrotate += footrotatespeed; //speed muter
  
    footrotateRange = Math.PI/32; //jarak geleng2
  
    footrotateAngle = Math.sin(footrotate)*footrotateRange; //sudut geleng2
  
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, footrotateAngle); //buat muter      
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
  

    GL.bindBuffer(GL.ARRAY_BUFFER, FRIGHTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, FRIGHTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FRIGHTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, frightfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, footrotateAngle); //buat muter      
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    GL.flush();

    window.requestAnimationFrame(animatefoot);
  };

  //KAKI KANAN DEPAN KIRI BELAKANG
  var time_prev=0;
  var period;
  var rotatewalkingfoot = 0;
  var rotatewalkingfootspeed = 0.1;
  var walkingfootRange;
  var walkingfootAngle;

  var animatewalkingfoot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    
  
    var dt = time - time_prev;
    time_prev = time;
  
      
    if (!drag) {
      dx *= friction;
      dy *= friction;
  
      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }
  

    //--MOVING--//
  
    rotatewalkingfoot += rotatewalkingfootspeed; //speed muter
  
    walkingfootRange = Math.PI/-32; //jarak geleng2
  
    walkingfootAngle = Math.sin(rotatewalkingfoot)*walkingfootRange; //sudut geleng2
  
    var currentTime = Date.now();
    var translateZ = Math.sin(currentTime * 0.005 ) * 1;

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.translateZ(MODEL_MATRIX, translateZ);
    LIBS.rotateX(MODEL_MATRIX, walkingfootAngle); 
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
  
    //FRONT RIGHT FOOT
    GL.bindBuffer(GL.ARRAY_BUFFER, FRIGHTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, FRIGHTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FRIGHTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, frightfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    // BACK LEFT FOOT
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.translateZ(MODEL_MATRIX, translateZ);
    LIBS.rotateX(MODEL_MATRIX, walkingfootAngle); 
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    GL.bindBuffer(GL.ARRAY_BUFFER, BLEFTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BLEFTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BLEFTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bleftfoot.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.flush();

    window.requestAnimationFrame(animatewalkingfoot);
  };

  //KAKI KIRI DEPAN KANAN BELAKANG

  var time_prev=0;
  var period;
  var rotatewalkingfoot2 = 0;
  var rotatewalkingfootspeed2 = 0.1;
  var walkingfootRange2;
  var walkingfootAngle2;

  var animatewalkingfoot2 = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    var dt = time - time_prev;
    time_prev = time;

    if (!drag) {
        dx *= friction;
        dy *= friction;

        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    //--MOVING--//

    rotatewalkingfoot2 += rotatewalkingfootspeed2; // Kecepatan rotasi
    walkingfootRange2 = Math.PI /32; // Rentang rotasi
    walkingfootAngle2 = Math.sin(rotatewalkingfoot2) * walkingfootRange2; // Sudut rotasi

    var currentTime = Date.now();
    var translateZ = Math.sin(currentTime * 0.005) * 1; // Translasi berbasis waktu

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.translateZ(MODEL_MATRIX, translateZ);
    LIBS.rotateX(MODEL_MATRIX, walkingfootAngle2); // Rotasi di sekitar sumbu Z
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

   // FRONT LEFT FOOT

   GL.bindBuffer(GL.ARRAY_BUFFER, FLEFTFOOT_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, FLEFTFOOT_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
   
   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FLEFTFOOT_FACES);
   
   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
   
   GL.drawElements(GL.TRIANGLES, fleftfoot.faces.length, GL.UNSIGNED_SHORT, 0);


    // BACK RIGHT FOOT
    GL.bindBuffer(GL.ARRAY_BUFFER, BRIGHTFOOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BRIGHTFOOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BRIGHTFOOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, brightfoot.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.flush();

    window.requestAnimationFrame(animatewalkingfoot2);
};
 

  //SISA
  var time_prev=0;
  var period;
  var translatewalkingrest = 0;
  var translatewalkingrestspeed = 0.1;
  var walkingrestrange;
  var walkingrestangle;

  var animatewalkingrest = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    
  
    var dt = time - time_prev;
    time_prev = time;
  
      
    if (!drag) {
      dx *= friction;
      dy *= friction;
  
      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }
  

    //--MOVING--//
  
   translatewalkingrest += translatewalkingrestspeed; //speed muter
  
    walkingrestrange = Math.PI/32; //jarak geleng2
  
    walkingrestangle = Math.sin(translatewalkingrest)*walkingrestrange; //sudut geleng2
  
    var currentTime = Date.now();
    var translateZ = Math.sin(currentTime * 0.005 ) * 1;

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.translateZ(MODEL_MATRIX, translateZ);
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);
  
    // BODY
    GL.bindBuffer(GL.ARRAY_BUFFER, BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BODY_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, body.faces.length, GL.UNSIGNED_SHORT, 0);

    // BODY2
    GL.bindBuffer(GL.ARRAY_BUFFER, BODY2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BODY2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BODY2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, body2.faces.length, GL.UNSIGNED_SHORT, 0);


    // BOTTOM
    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, bottom.faces.length, GL.UNSIGNED_SHORT, 0);

    // HEAD
    GL.bindBuffer(GL.ARRAY_BUFFER, HEAD_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HEAD_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HEAD_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, head.faces.length, GL.UNSIGNED_SHORT, 0);

    // LEFTEAR
    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEAR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEAR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFTEAR_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, leftear.faces.length, GL.UNSIGNED_SHORT, 0);

    // RIGHTEAR
    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEAR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEAR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHTEAR_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, rightear.faces.length, GL.UNSIGNED_SHORT, 0);

    // LEFTEYE
    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEYE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, LEFTEYE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFTEYE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, lefteye.faces.length, GL.UNSIGNED_SHORT, 0);

    // RIGHTEYE
    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEYE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHTEYE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHTEYE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, righteye.faces.length, GL.UNSIGNED_SHORT, 0);

    // NOSE
    GL.bindBuffer(GL.ARRAY_BUFFER, NOSE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, NOSE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, NOSE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, nose.faces.length, GL.UNSIGNED_SHORT, 0);

    var alis1 = [
      [-0.8, 0.95, 6.36],
      [-0.75, 1, 6.36],
      [-0.70, 1.05, 6.36],
      [-0.65, 1.1, 6.36],
      [-0.60, 1.15, 6.36],
      [-0.55, 1.2, 6.36],
      [-0.50, 1.15, 6.36],
      [-0.45, 1.1, 6.36],
      [-0.40, 1.05, 6.36],
      [-0.35, 1, 6.36],
      [-0.30, 0.95, 6.39],
    ];
  
    var alis2 = [
      [0.8, 0.95, 6.36],
      [0.75, 1, 6.36],
      [0.70, 1.05, 6.36],
      [0.65, 1.1, 6.36],
      [0.60, 1.15, 6.36],
      [0.55, 1.2, 6.36],
      [0.50, 1.15, 6.36],
      [0.45, 1.1, 6.36],
      [0.40, 1.05, 6.36],
      [0.35, 1, 6.36],
      [0.30, 0.95, 6.39],
    ];
  
    var mulut = [
      [-0.50, -0.5, 6.3],
      [-0.45, -0.76, 6.2],
      [-0.4, -0.76, 6.2],
      [-0.35, -0.77, 6.2],
      [-0.3, -0.78, 6.2],
      [-0.25, -0.79, 6.2],
      [-0.2, -0.8, 6.2],
      [-0.15, -0.81, 6.2],
      [0, -0.81, 6.2],
      [0.15, -0.81, 6.2],
      [0.2, -0.8, 6.2],
      [0.25, -0.79, 6.2],
      [0.30, -0.78, 6.2],
      [0.35, -0.77, 6.2],
      [0.40, -0.76, 6.2],
      [0.45, -0.75, 6.2],
      [0.50, -0.5, 6.3],
    ];
      
      drawBezierCurve(GL, SHADER_PROGRAM, alis1, 100);
      drawBezierCurve(GL, SHADER_PROGRAM, alis2, 100);
      drawBezierCurve(GL, SHADER_PROGRAM, mulut, 100);

    // TIE
    GL.bindBuffer(GL.ARRAY_BUFFER, TIE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TIE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIE_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, tie.faces.length, GL.UNSIGNED_SHORT, 0);

    // TIEDOT
    GL.bindBuffer(GL.ARRAY_BUFFER, TIEDOT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TIEDOT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIEDOT_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, tiedot.faces.length, GL.UNSIGNED_SHORT, 0);

  
      // TOPENG1
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG1_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG1_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG1_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, topeng1.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // TOPENG2
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG2_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG2_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG2_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, topeng2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // TOPENG3
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG3_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG3_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG3_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, topeng3.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // TOPENG4
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG4_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG4_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG4_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, topeng4.faces.length, GL.UNSIGNED_SHORT, 0);
      
      // TOPENG5
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG5_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOPENG5_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOPENG5_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, topeng5.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // PIPIKIRI
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKIRI_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKIRI_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPIKIRI_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, pipikiri.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // PIPIKANAN
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKANAN_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPIKANAN_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPIKANAN_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, pipikanan.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // PIPITENGAH
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPITENGAH_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, PIPITENGAH_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
      
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PIPITENGAH_FACES);
      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
      
      GL.drawElements(GL.TRIANGLES, pipitengah.faces.length, GL.UNSIGNED_SHORT, 0);
  
    GL.flush();

    window.requestAnimationFrame(animatewalkingrest);
  };

    animate(0);
    animateKaki(0);
    animateEye(0);

    // animateg(0);
    // animatefoot(0);
    animatewalkingfoot(0);
    animatewalkingfoot2(0);
    animatewalkingrest(0);
  }
  window.addEventListener("load", main);
  
   function setTranslateMove(x, y, z) {
    LIBS.rotateX(this.MOVEMATRIX, x);
    LIBS.rotateY(this.MOVEMATRIX, y);
    LIBS.rotateZ(this.MOVEMATRIX, z);
  }
  