function start() {

    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    var horizontalSlider = document.getElementById('slider1');
    horizontalSlider.value = 0;
    var verticalSlider = document.getElementById('slider2');
    verticalSlider.value = 0;

    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(vertexShader)); 
        return null;
    }
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(fragmentShader));
        
        return null;
    }
    
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("AYE YO, THIS SHIT BROKEN"); }
    gl.useProgram(shaderProgram);	    
    
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);
    shaderProgram.texSampler2 = gl.getUniformLocation(shaderProgram, "texSampler2");
    gl.uniform1i(shaderProgram.texSampler2, 1);

    var vertexPos = new Float32Array([
        // Base
        -1.0, -1.0, -1.0, // 0: Bottom left
         1.0, -1.0, -1.0, // 1: Bottom right
         1.0, -1.0,  1.0, // 2: Top right
        -1.0, -1.0,  1.0, // 3: Top left
        // Top
         0.0,  1.0,  0.0, // 4: Apex
    ]);
    
    var vertexNormals = new Float32Array([
        // Base - normal pointing downwards
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
        // Sides - approximate normals for simplicity
         0.0,  0.5,  0.0,
         0.0,  0.5,  0.0,
         0.0,  0.5,  0.0,
         0.0,  0.5,  0.0,
    ]);
    
    var triangleIndices = new Uint8Array([
        // Base
        0, 1, 2,   0, 2, 3,
        // Sides
        0, 1, 4,   1, 2, 4,
        2, 3, 4,   3, 0, 4
    ]);
    
    var vertexTextureCoords = new Float32Array([
        // Base
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Apex for sides
        0.5, 0.5,
        0.5, 0.5,
        0.5, 0.5,
        0.5, 0.5,
    ]);
    
    // var vertexPos = new Float32Array([
    //     // Front face
    //     -1.0, -1.0,  1.0,
    //      1.0, -1.0,  1.0,
    //      1.0,  1.0,  1.0,
    //     -1.0,  1.0,  1.0,
    //     // Back face
    //     -1.0, -1.0, -1.0,
    //      1.0, -1.0, -1.0,
    //      1.0,  1.0, -1.0,
    //     -1.0,  1.0, -1.0,
    //     // Top face
    //     -1.0,  1.0, -1.0,
    //     -1.0,  1.0,  1.0,
    //      1.0,  1.0,  1.0,
    //      1.0,  1.0, -1.0,
    //     // Bottom face
    //     -1.0, -1.0, -1.0,
    //      1.0, -1.0, -1.0,
    //      1.0, -1.0,  1.0,
    //     -1.0, -1.0,  1.0,
    //     // Right face
    //      1.0, -1.0, -1.0,
    //      1.0,  1.0, -1.0,
    //      1.0,  1.0,  1.0,
    //      1.0, -1.0,  1.0,
    //     // Left face
    //     -1.0, -1.0, -1.0,
    //     -1.0, -1.0,  1.0,
    //     -1.0,  1.0,  1.0,
    //     -1.0,  1.0, -1.0
    // ]);

    // var vertexNormals = new Float32Array([
    //     // Front
    //      0.0,  0.0,  1.0,
    //      0.0,  0.0,  1.0,
    //      0.0,  0.0,  1.0,
    //      0.0,  0.0,  1.0,
    //     // Back
    //      0.0,  0.0, -1.0,
    //      0.0,  0.0, -1.0,
    //      0.0,  0.0, -1.0,
    //      0.0,  0.0, -1.0,
    //     // Top
    //      0.0,  1.0,  0.0,
    //      0.0,  1.0,  0.0,
    //      0.0,  1.0,  0.0,
    //      0.0,  1.0,  0.0,
    //     // Bottom
    //      0.0, -1.0,  0.0,
    //      0.0, -1.0,  0.0,
    //      0.0, -1.0,  0.0,
    //      0.0, -1.0,  0.0,
    //     // Right
    //      1.0,  0.0,  0.0,
    //      1.0,  0.0,  0.0,
    //      1.0,  0.0,  0.0,
    //      1.0,  0.0,  0.0,
    //     // Left
    //     -1.0,  0.0,  0.0,
    //     -1.0,  0.0,  0.0,
    //     -1.0,  0.0,  0.0,
    //     -1.0,  0.0,  0.0
    // ]);

    var vertexColors = new Float32Array(
        [  0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0, // Front face (black)
           0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0, // Back face (black)
           0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0, // Top face (black)
           0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0, // Bottom face (black)
           0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0, // Right face (black)
           0, 0, 0,  0, 0, 0,  0, 0, 0,  0, 0, 0  // Left face (black)
        ]);
    
    //        var vertexTextureCoords = new Float32Array([
    //         // Front
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Back
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Top
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Bottom
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Right
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Left
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0
    //     ]);
        
    //     var triangleIndices = new Uint8Array([
    //         0, 1, 2,      0, 2, 3,    // Front
    //         4, 5, 6,      4, 6, 7,    // Back
    //         8, 9, 10,     8, 10, 11,  // Top
    //         12, 13, 14,   12, 14, 15, // Bottom
    //         16, 17, 18,   16, 18, 19, // Right
    //         20, 21, 22,   20, 22, 23  // Left
    //     ]);

    var trianglePosBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuff);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuff.itemSize = 3;
    trianglePosBuff.numItems = 5;
    
    var triangleNormBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormBuff);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormBuff.itemSize = 3;
    triangleNormBuff.numItems = 5;
    
    var colorBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuff.itemSize = 3;
    colorBuff.numItems = 5;

    var textureBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuff);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuff.itemSize = 2;
    textureBuff.numItems = 5;

    var indexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);    

    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image1 = new Image();

    var texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image2 = new Image();

    function initTextureThenDraw()
    {
      image1.onload = function() { loadTexture(image1, texture1); };
      image1.crossOrigin = "anonymous";
      image1.src = "https://i.postimg.cc/wBC4DrSF/9e89b6cc7e92bb64377805ee3e55b355.jpg"; // UW Logo

      image2.onload = function() { loadTexture(image2, texture2); };
      image2.crossOrigin = "anonymous";
      image2.src = "https://i.postimg.cc/wBC4DrSF/9e89b6cc7e92bb64377805ee3e55b355.jpg"; 

      window.setTimeout(draw, 200);
    }

    function loadTexture(image, texture)
    {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }    

    function draw() {
    
        var angle1 = horizontalSlider.value*0.01*Math.PI;
        var angle2 = verticalSlider.value*0.01*Math.PI;
    
        var eye = [69 * Math.sin(angle1), 150.0, 420.0 * Math.cos(angle1)];
        var target = [0, 0, 0];
        var up = [0, -1, 0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100, 100, 100]);
        mat4.rotate(tModel,tModel,angle2,[1, 1, 1]);
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection, Math.PI / 2, 1, 10, 1000);
      
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); 
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
      
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuff);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuff.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormBuff);

        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormBuff.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);

        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuff.itemSize, gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuff);
        
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuff.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture2);

        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);

    }

    horizontalSlider.addEventListener("input",draw);
    verticalSlider.addEventListener("input",draw);
    initTextureThenDraw();
}

window.onload=start;