function generateTorus(x, y, z, c1, c2, c3, radius1, radius2, segments1, segments2, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
  
    for (var i = 0; i <= segments1; i++) {
        var u = (2 * Math.PI * i) / segments1;
  
        for (var j = 0; j <= segments2; j++) {
            var v = (2 * Math.PI * j) / segments2;
  
            // Calculate vertex position relative to torus's center
            var torusCenterX = x + ((radius1 + radius2 * Math.cos(v)) * Math.cos(u));
            var torusCenterY = y + ((radius1 + radius2 * Math.cos(v)) * Math.sin(u));
            var torusCenterZ = z + (radius2 * Math.sin(v));
  
            // Apply rotations relative to the torus's center
            var rotatedX = torusCenterX - x;
            var rotatedY = torusCenterY - y;
            var rotatedZ = torusCenterZ - z;
  
            // Rotate around X axis
            var tempY = rotatedY;
            rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
            rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
  
            // Rotate around Y axis
            var tempX = rotatedX;
            rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
            rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
  
            // Rotate around Z axis
            var tempX2 = rotatedX;
            rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
            rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
  
            // Translate the vertex back to its original position relative to the torus's center
            rotatedX += x;
            rotatedY += y;
            rotatedZ += z;
  
            vertices.push(rotatedX, rotatedY, rotatedZ);
          
            colors.push(c1,c2,c3);
        }
    }
  
    var faces = [];
    for (var i = 0; i < segments1; i++) {
        for (var j = 0; j < segments2; j++) {
            var index = i * (segments2 + 1) + j;
            var nextIndex = index + segments2 + 1;
  
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
  
    return { vertices: vertices, colors: colors, faces: faces };
  }
  
  function generateCurvedTriangle(x, y, z, c1, c2, c3, radius1, radius2, segments1, segments2) {
      var vertices = [];
      var colors = [];
  
      for (var i = 0; i <= segments1; i++) {
          var u = (2 * Math.PI * i) / segments1;
    
          for (var j = 0; j <= segments2; j++) {
              var v = (2 * Math.PI * j) / segments2;
    
              var xCoord = x + ((radius1 + radius2 * Math.cos(u)) * Math.cos(v));
              var yCoord = y + ((radius1 + radius2 * Math.sin(u)) * Math.sin(u));
              var zCoord = z + (radius2 * Math.sin(v));
    
              vertices.push(xCoord, yCoord, zCoord);
    
              colors.push(c1,c2,c3);
          }
      }
    
      var faces = [];
      for (var i = 0; i < segments1; i++) {
          for (var j = 0; j < segments2; j++) {
              var index = i * (segments2 + 1) + j;
              var nextIndex = index + segments2 + 1;
    
              faces.push(index, nextIndex, index + 1);
              faces.push(nextIndex, nextIndex + 1, index + 1);
          }
      }
    
      return { vertices: vertices, colors: colors, faces: faces };
  }
  
  function generateSphere(x, y, z, c1, c2, c3, radius, segments) {
      var vertices = [];
      var colors = [];
  
      var ball_color = [
          [c1,c2,c3]
      ];
    
      for (var i = 0; i <= segments; i++) {
          var latAngle = Math.PI * (-0.5 + (i / segments));
          var sinLat = Math.sin(latAngle);
          var cosLat = Math.cos(latAngle);
    
          for (var j = 0; j <= segments; j++) {
              var lonAngle = 2 * Math.PI * (j / segments);
              var sinLon = Math.sin(lonAngle);
              var cosLon = Math.cos(lonAngle);
    
              var xCoord = cosLon * cosLat;
              var yCoord = sinLon * cosLat;
              var zCoord = sinLat;
    
              var vertexX = x + radius * xCoord;
              var vertexY = y + radius * yCoord;
              var vertexZ = z + radius * zCoord;
    
              vertices.push(vertexX, vertexY, vertexZ);
    
              var colorIndex = j % ball_color.length;
              colors = colors.concat(ball_color[colorIndex]);
          }
      }
    
      var ball_faces = [];
      for (var i = 0; i < segments; i++) {
          for (var j = 0; j < segments; j++) {
              var index = i * (segments + 1) + j;
              var nextIndex = index + segments + 1;
    
              ball_faces.push(index, nextIndex, index + 1);
              ball_faces.push(nextIndex, nextIndex + 1, index + 1);
          }
      }
    
      return { vertices: vertices, colors: colors, faces: ball_faces };
    }
    function generateTubeP(x, y, z, c1, c2, c3, height, bottomRadius, topRadius, segments) {
        var angle_increment = (2 * Math.PI) / segments;
        var vertices = [];
        var colors = [];
        var faces = [];
    
        for (var i = 0; i < segments; i++) {
            var angle1 = i * angle_increment;
            var angle2 = (i + 1) * angle_increment;
    
            // Bottom vertices
            vertices.push(x + bottomRadius * Math.cos(angle1), y + bottomRadius * Math.sin(angle1), z);
            vertices.push(x + bottomRadius * Math.cos(angle2), y + bottomRadius * Math.sin(angle2), z);
    
            // Top vertices
            vertices.push(x + topRadius * Math.cos(angle1), y + topRadius * Math.sin(angle1), z + height);
            vertices.push(x + topRadius * Math.cos(angle2), y + topRadius * Math.sin(angle2), z + height);
    
            // Colors for all vertices
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
    
            // Faces for this segment
            var baseIndex = i * 4;
            faces.push(baseIndex, baseIndex + 1, baseIndex + 2); // Triangle 1
            faces.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // Triangle 2
        }
    
        // Closing faces for top and bottom circles
        for (var i = 0; i < segments - 1; i++) {
            // Bottom circle
            faces.push(i * 4, (i + 1) * 4, vertices.length / 3 - 2);
            // Top circle
            faces.push(i * 4 + 2, (i + 1) * 4 + 2, vertices.length / 3 - 1);
        }
    
        // Close the last segment with the first one
        faces.push((segments - 1) * 4, 0, vertices.length / 3 - 2);
        faces.push((segments - 1) * 4 + 2, 2, vertices.length / 3 - 1);
    
        return { vertices: vertices, colors: colors, faces: faces };
    }
    function generateHyperboloidg(x, y, z, a, b, c, c1, c2, c3, segments) {
        var vertices = [];
        var colors = [];
      
        for (var i = 0; i <= segments; i++) {
            var u = -Math.PI + (2 * Math.PI * i) / segments;
      
            for (var j = 0; j <= segments; j++) {
                var v = -Math.PI / 3 + ((Math.PI / 1.5) * j) / segments;
      
                var xCoord = x + (c * Math.tan(v));
                var yCoord = y + (a / Math.cos(v)) * Math.cos(u);
                var zCoord = z + (b / Math.cos(v)) * Math.sin(u);
      
                vertices.push(xCoord, yCoord, zCoord);
      
                colors.push(c1, c2, c3);
            }
        }
      
        var faces = [];
        for (var i = 0; i < segments; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
      
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
      
        return { vertices: vertices, colors: colors, faces: faces };
    }
    
    
    // function generateTube(x, y, z, c1, c2, c3, height, bottomRadius, topRadius, segments) {
    //   var angle_increment = (2 * Math.PI) / segments;
    //   var vertices = [];
    //   var colors = [];
    //   var faces = [];
    
    //   for (var i = 0; i < segments; i++) {
    //       var angle1 = i * angle_increment;
    //       var angle2 = (i + 1) * angle_increment;
    
    //       // Bottom vertices
    //       vertices.push(x + bottomRadius * Math.cos(angle1), y, z + bottomRadius * Math.sin(angle1));
    //       vertices.push(x + bottomRadius * Math.cos(angle2), y, z + bottomRadius * Math.sin(angle2));
    
    //       // Top vertices
    //       vertices.push(x + topRadius * Math.cos(angle1), y + height, z + topRadius * Math.sin(angle1));
    //       vertices.push(x + topRadius * Math.cos(angle2), y + height, z + topRadius * Math.sin(angle2));
    
    //       // Colors for all vertices
    //       colors.push(c1,c2,c3);
    //       colors.push(c1,c2,c3);
    //       colors.push(c1,c2,c3);
    //       colors.push(c1,c2,c3);
    
    //       // Faces for this segment
    //       var baseIndex = i * 4;
    //       faces.push(baseIndex, baseIndex + 1, baseIndex + 2); // Triangle 1
    //       faces.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // Triangle 2
    //   }
    
    //   // Closing faces for top and bottom circles
    //   for (var i = 0; i < segments - 1; i++) {
    //       // Bottom circle
    //       faces.push(i * 4, (i + 1) * 4, vertices.length / 3 - 2);
    //       // Top circle
    //       faces.push(i * 4 + 2, (i + 1) * 4 + 2, vertices.length / 3 - 1);
    //   }
    
    //   // Close the last segment with the first one
    //   faces.push((segments - 1) * 4, 0, vertices.length / 3 - 2);
    //   faces.push((segments - 1) * 4 + 2, 2, vertices.length / 3 - 1);
    
    //   return { vertices: vertices, colors: colors, faces: faces };
    // }
  
    function generateEllipsoid(x, y, z, a, b, c, c1, c2, c3, segments) {
      var vertices = [];
      var colors = [];
    
      for (var i = 0; i <= segments; i++) {
        var u = -Math.PI + (2 * Math.PI * i) / segments;
    
        for (var j = 0; j <= segments; j++) {
          var v = -Math.PI + (2 * Math.PI * j) / segments;
    
          var xCoord = x + (a * Math.cos(v) * Math.cos(u));
          var yCoord = y + (b * Math.cos(v) * Math.sin(u));
          var zCoord = z + (c * Math.sin(v));
    
          vertices.push(xCoord, yCoord, zCoord);
    
          colors.push(c1,c2,c3);
        }
      }
    
      var faces = [];
      for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
          var index = i * (segments + 1) + j;
          var nextIndex = index + segments + 1;
    
          faces.push(index, nextIndex, index + 1);
          faces.push(nextIndex, nextIndex + 1, index + 1);
        }
      }
    
      return { vertices: vertices, colors: colors, faces: faces };
    }
    
    function generateHalfSphere(x, y, z, c1, c2, c3, radius, segments) {
      var vertices = [];
      var colors = [];
  
      var ball_color = [
          [c1,c2,c3]
      ];
    
      for (var i = 0; i <= segments/2; i++) {
          var latAngle = Math.PI * (-0.5 + (i / segments));
          var sinLat = Math.sin(latAngle);
          var cosLat = Math.cos(latAngle);
    
          for (var j = 0; j <= segments; j++) {
              var lonAngle = 2 * Math.PI * (j / segments);
              var sinLon = Math.sin(lonAngle);
              var cosLon = Math.cos(lonAngle);
    
              var xCoord = cosLon * cosLat;
              var yCoord = sinLon * cosLat;
              var zCoord = sinLat;
    
              var vertexX = x + radius * xCoord;
              var vertexY = y + radius * yCoord;
              var vertexZ = z + radius * zCoord;
    
              vertices.push(vertexX, vertexY, vertexZ);
              
              var colorIndex = j % ball_color.length;
              colors = colors.concat(ball_color[colorIndex]);
          }
      }
    
      var ball_faces = [];
      for (var i = 0; i < segments/2; i++) {
          for (var j = 0; j < segments; j++) {
              var index = i * (segments + 1) + j;
              var nextIndex = index + segments + 1;
    
              ball_faces.push(index, nextIndex, index + 1);
              ball_faces.push(nextIndex, nextIndex + 1, index + 1);
          }
      }
    
      return { vertices: vertices, colors: colors, faces: ball_faces };
    }
  
  
    function generateHyperboloid(x, y, z, a, b, c, c1, c2, c3, segments) {
        var vertices = [];
        var colors = [];
      
        for (var i = 0; i <= segments; i++) {
          var u = -Math.PI + (2 * Math.PI * i) / segments;
      
          for (var j = 0; j <= segments; j++) {
            var v = -Math.PI / 3 + ((Math.PI / 1.5) * j) / segments;
      
            var xCoord = x + (a / Math.cos(v)) * Math.cos(u);
            var yCoord = y + (b / Math.cos(v)) * Math.sin(u);
            var zCoord = z + (c * Math.tan(v));
      
            vertices.push(xCoord, yCoord, zCoord);
      
            colors.push(c1,c2,c3);
          }
        }
      
        var faces = [];
        for (var i = 0; i < segments; i++) {
          for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
      
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
          }
        }
      
        return { vertices: vertices, colors: colors, faces: faces };
      }
  
      function generateTubeM(x, y, z, r, g, b, length, bottomRadius, topRadius, segments) {
        var angle_increment = (2 * Math.PI) / segments;
        var vertices = [];
        var colors = [];
        var faces = [];
      
        for (var i = 0; i < segments; i++) {
            var angle1 = i * angle_increment;
            var angle2 = (i + 1) * angle_increment;
      
            // Bottom vertices
            vertices.push(x, y + bottomRadius * Math.cos(angle1), z + bottomRadius * Math.sin(angle1));
            vertices.push(x, y + bottomRadius * Math.cos(angle2), z + bottomRadius * Math.sin(angle2));
      
            // Top vertices
            vertices.push(x + length, y + topRadius * Math.cos(angle1), z + topRadius * Math.sin(angle1));
            vertices.push(x + length, y + topRadius * Math.cos(angle2), z + topRadius * Math.sin(angle2));
      
            // Colors for all vertices
            colors.push(r,g,b);
            colors.push(r,g,b);
            colors.push(r,g,b);
            colors.push(r,g,b);
      
            // Faces for this segment
            var baseIndex = i * 4;
            faces.push(baseIndex, baseIndex + 1, baseIndex + 2); // Triangle 1
            faces.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // Triangle 2
        }
      
        // Closing faces for top and bottom circles
        for (var i = 0; i < segments - 1; i++) {
            // Bottom circle
            faces.push(i * 4, (i + 1) * 4, vertices.length / 3 - 2);
            // Top circle
            faces.push(i * 4 + 2, (i + 1) * 4 + 2, vertices.length / 3 - 1);
        }
      
        // Close the last segment with the first one
        faces.push((segments - 1) * 4, 0, vertices.length / 3 - 2);
        faces.push((segments - 1) * 4 + 2, 2, vertices.length / 3 - 1);
      
        return { vertices: vertices, colors: colors, faces: faces };
      }
  
      function generateEllipticParaboloid(x, y, z, a, b, r, g, bl, segments) {
        var vertices = [];
        var colors = [];
    
        for (var i = 0; i <= segments; i++) {
          var u = -Math.PI + (2 * Math.PI * i) / segments;
    
          for (var j = 0; j <= segments; j++) {
            var v = (j) / segments;
            var xCoord = x + (a * v * Math.cos(u));
            var yCoord = y + (b * v * Math.sin(u));
            var zCoord = z + (Math.pow(v, 2));
    
            vertices.push(xCoord, yCoord, zCoord);
            colors.push(r, g, bl);
          }
        }
    
        var faces = [];
        for (var i = 0; i < segments; i++) {
          for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
          }
        }
    return { vertices: vertices, colors: colors, faces: faces };
    }
  
    function createEllipticCone(x, y, z, radiusX, radiusY, height, r,g,b1,segments) {
      var vertices = [];
      var colors = [];
      var faces =[];
  
      // Create vertices for the base of the cone
      for (var i = 0; i < segments; i++) {
          var theta = (i / segments) * Math.PI * 2;
          var baseX = x + radiusX * Math.cos(theta);
          var baseY = y + radiusY * Math.sin(theta);
          vertices.push(baseX, baseY, z);
          // Assuming uniform color for the base
          colors.push(r, g, b1); // Adjust color as needed
      }
  
  
      vertices.push(x, y, z + height);
  
      for (var i = 0; i < segments - 1; i++) {
        faces.push(i, (i + 1) % segments, segments);
        colors.push(r, g, b1);
    }
    faces.push(segments - 1, 0, segments);
  
    return { vertices: vertices, colors: colors, faces: faces };
  
  }
  
  function drawBezierCurve(GL, shaderProgram, points, segments) {
    var vertices = [];
    
    // Calculate Bezier curve points
    for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var point = calculateBezierPoint(points, t);
        vertices.push(point[0], point[1]-0.5, point[2]);
    }
    
    // Create buffer for the curve vertices
    var curveBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, curveBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    
    // Specify vertex attributes
    var positionAttribLocation = GL.getAttribLocation(shaderProgram, "position");
    GL.vertexAttribPointer(positionAttribLocation, 3, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray(positionAttribLocation);
    
    // Draw the curve
    GL.drawArrays(GL.LINE_STRIP, 0, vertices.length / 3);
    
    // Clean up
    GL.deleteBuffer(curveBuffer);
  }
  function updateCloudPositions() {
    // Loop through each cloud and update its position
    clouds.forEach(function(cloud) {
        // Update the position of the cloud
        cloud.position.x += 0.01; // Example: Move the cloud along the x-axis
        cloud.position.z += 0.01; // Example: Move the cloud along the z-axis
  
        // You can add more complex movement logic here
    });
  }
  
  function calculateBezierPoint(points, t) {
    var n = points.length - 1;
    var result = [0, 0, 0];
    for (var i = 0; i <= n; i++) {
        var coefficient = binomialCoefficient(n, i) * Math.pow((1 - t), n - i) * Math.pow(t, i);
        result[0] += coefficient * points[i][0];
        result[1] += coefficient * points[i][1];
        result[2] += coefficient * points[i][2];
    }
    return result;
  }
  function generateEllipticParaboloidg(x, y, z, a, b, r, g, bl, segments) {
    var vertices = [];
    var colors = [];
  
    for (var i = 0; i <= segments; i++) {
      var u = -Math.PI + (2 * Math.PI * i) / segments;
  
      for (var j = 0; j <= segments; j++) {
        var v = (j) / segments;
        var xCoord = x + (a * v * Math.cos(u));
        var yCoord = y + (b * v * Math.sin(u));
        var zCoord = z + (Math.pow(v, 2));
  
        vertices.push(xCoord, yCoord, zCoord);
        colors.push(r, g, bl);
      }
    }
  
    var faces = [];
    for (var i = 0; i < segments; i++) {
      for (var j = 0; j < segments; j++) {
        var index = i * (segments + 1) + j;
        var nextIndex = index + segments + 1;
        faces.push(index, nextIndex, index + 1);
        faces.push(nextIndex, nextIndex + 1, index + 1);
      }
    }
  
    // Fungsi rotasi sumbu y
    function rotateY(vertices, angle) {
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var newVertices = [];
  
      for (var i = 0; i < vertices.length; i += 3) {
        var x = vertices[i];
        var z = vertices[i + 2];
  
        newVertices.push(
          cos * x + sin * z,
          vertices[i + 1],
          -sin * x + cos * z
        );
      }
      return newVertices;
    }
  
    // Fungsi rotasi sumbu x
    function rotateX(vertices, angle) {
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var newVertices = [];
  
      for (var i = 0; i < vertices.length; i += 3) {
        var y = vertices[i + 1];
        var z = vertices[i + 2];
  
        newVertices.push(
          vertices[i],
          cos * y - sin * z,
          sin * y + cos * z
        );
      }
      return newVertices;
    }
  
    // Memanggil fungsi rotasi sumbu y dan x sebelum mengembalikan vertices
    return { vertices: rotateY(vertices, Math.PI), colors: colors, faces: faces };
  }
  function binomialCoefficient(n, k) {
    if (k === 0 || k === n) return 1;
    if (k === 1 || k === n - 1) return n;
    var numerator = 1;
    var denominator = 1;
    for (var i = 1; i <= k; i++) {
        numerator *= (n - i + 1);
        denominator *= i;
    }
    return numerator / denominator;
  }
  
  function generateCloud(x, y, z, numSpheres, minRadius, maxRadius, minHeight, maxHeight, segments) {
    var cloudVertices = [];
    var cloudColors = [];
    var cloudFaces = [];
  
    for (var i = 0; i < numSpheres; i++) {
        var radius = Math.random() * (maxRadius - minRadius) + minRadius;
        var xPos = x + (Math.random() * 2 - 1) * maxRadius; // Random x-coordinate within the cloud area
        var yPos = y + (Math.random() * 2 - 1) * maxRadius; // Random y-coordinate within the cloud area
        var zPos = z + (Math.random() * 2 - 1) * maxRadius; // Random z-coordinate within the cloud area
        var height = Math.random() * (maxHeight - minHeight) + minHeight;
  
        var sphere = generateSphere(xPos, yPos, zPos, 1, 1, 1, radius, segments);
  
        // Translate the sphere vertices to the desired position
        for (var j = 0; j < sphere.vertices.length; j += 3) {
            sphere.vertices[j] += xPos;
            sphere.vertices[j + 1] += yPos;
            sphere.vertices[j + 2] += zPos;
        }
  
        // Add the vertices, colors, and faces of the sphere to the cloud arrays
        cloudVertices.push(...sphere.vertices);
        cloudColors.push(...sphere.colors);
        cloudFaces.push(...sphere.faces);
    }
  
    return { vertices: cloudVertices, colors: cloudColors, faces: cloudFaces };
  }
  // function generateRandomSphere() {
  //   const radius = Math.random() * 0.5 + 0.1 ; // Random radius between 0.1 and 0.6
  //   const x = (Math.random() ); // Random x-coordinate between -10 and 10
  //   const y = (Math.random() ) ; // Random y-coordinate between -10 and 10
  //   const z = (Math.random()) ; // Random z-coordinate above 5
  
  //   const color = [
  //       Math.random(), // Random red component
  //       Math.random(), // Random green component
  //       Math.random(), // Random blue component
  //   ];
  
  //   return generateSphere(radius, x, y, z, color[0], color[1], color[2], 20);
  // }
  
  // function generateRandomSpheres(numSpheres) {
  //   const spheres = [];
  //   for (let i = 0; i < numSpheres; i++) {
  //       spheres.push(generateRandomSphere());
  //   }
  //   return spheres;
  // }
  
  
      // Tambahi funsi generate<   >( ) copas dari code kelas, gausa di copy sampe main
  
      function generateRandomClouds() {
        var clouds = [];
    
        for (var i = 0; i < 10; i++) {
            // Random position above y-coordinate 5
            var xPos = Math.random() * 20 - 10; // Random x-coordinate between -10 and 10
            var yPos = Math.random() * 5 + 5; // Random y-coordinate between 5 and 10
            var zPos = Math.random() * 20 - 10; // Random z-coordinate between -10 and 10
    
            // Random parameters for cloud shape
            var numSpheres = Math.floor(Math.random() * 6) + 5; // Random number of spheres between 5 and 10
            var minRadius = Math.random() * 0.5 + 0.5; // Random min radius between 0.5 and 1
            var maxRadius = Math.random() * 1.5 + 1; // Random max radius between 1 and 2
            var minHeight = Math.random() * 0.5 + 1; // Random min height between 1 and 1.5
            var maxHeight = Math.random() * 2 + 2; // Random max height between 2 and 4
            var segments = Math.floor(Math.random() * 10) + 10; // Random number of segments between 10 and 20
    
            var cloud = generateCloud(xPos, yPos, zPos, numSpheres, minRadius, maxRadius, minHeight, maxHeight, segments);
            clouds.push(cloud);
        }
    
        return clouds;
    }