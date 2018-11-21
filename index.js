var module_a = require('./module.a');

{
    module_a.getFun();
    module_a.getFun2();

    console.clear()
}

{
    var buffer_img = require('./buffer.img');
    require('fs').writeFile('logo.png', buffer_img)
}
