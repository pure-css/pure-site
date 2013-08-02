var menu = document.getElementById('menu'),
    menuLink = document.getElementById('menuLink'),
    layout = document.getElementById('layout'),

    toggleClass = function (element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    };

    menuLink.onclick = function (e) {
        e.preventDefault();
        var active = 'active';
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };
