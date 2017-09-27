function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}

// Warning : up has to be normalized !
function lookAt(eye, center, up)
{
    var f = new Point(center.X - eye.X, center.Y - eye.Y, center.Z - eye.Z) ;
    var nf = 1./Math.sqrt(f.X*f.X + f.Y*f.Y + f.Z*f.Z) ;
    f.X *= nf ;
    f.Y *= nf ;
    f.Z *= nf ;
    var s = new Point(0, 0, 0) ;
    var u = new Point(0, 0, 0) ;
    f.prodVect(up, s) ;
    s.prodVect(f, u) ;
    var m = $M([[s.X, s.Y, s.Z, 0],
                         [u.X, u.Y, u.Z, 0],
                         [-f.X, -f.Y, -f.Z, 0],
                         [0, 0, 0, 1]]) ;
    lib_matrix_multMatrix(m) ;
    lib_matrix_mvTranslate([-eye.X, -eye.Y, -eye.Z]) ;
    delete(f) ;
    delete(s) ;
    delete(u) ;
    delete(m) ;
}