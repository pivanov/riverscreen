const HIDDEN_ROLES = ['system', 'input', 'homescreen'];

function populate() {
  let icons = document.querySelector("#icons");
  let appMgr = navigator.mozApps.mgmt;
  appMgr.getAll().onsuccess = function(event) {
    let apps = event.target.result;
    let fragment = document.createDocumentFragment();
    for (let app of apps) {
      if (HIDDEN_ROLES.indexOf(app.manifest.role) > -1)
        continue
      if (app.manifest.entry_points) {
        for (let k in app.manifest.entry_points) {
          fragment.appendChild(createIcon(app, k));
        }
      } else {
        fragment.appendChild(createIcon(app));
      }
    }
    icons.innerHTML = "";
    icons.appendChild(fragment);
  }
}

function createIcon(app, entryKey) {
  let div = document.createElement("div");
  div.className = "icon";
  div.style.backgroundImage = 'url(' + app.origin + icon(app) + ')';

  let name;

  if (entryKey) {
    name = app.manifest.entry_points[entryKey].name;
    div.setAttribute("entry-point", entryKey);
  } else {
    name = app.manifest.name;
  }

  div.setAttribute("manifest-url", app.manifestURL);

  let character = document.createElement("span");
  character.className = "character";

  let span = document.createElement("span");
  span.textContent = name;

  let label = document.createElement("label");
  label.appendChild(span);

  div.appendChild(character);
  div.appendChild(label);

  div.onclick = function() {
    if (entryKey)
      app.launch(entryKey);
    else
      app.launch();
  }

  return div;
}

function icon(app) {
  var icons = app.manifest.icons;
  if (!icons) {
    return '';
  }

  var lastIcon = 0;
  for (var i in icons) {
    if (i > lastIcon) {
      lastIcon = i;
    }
  }
  return icons[lastIcon];
}

window.addEventListener("DOMContentLoaded", () => {
  let appMgr = navigator.mozApps.mgmt;
  appMgr.oninstall = populate;
  appMgr.onuninstall = populate;
  populate();
}, true);
