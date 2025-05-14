// This data structure defines the hierarchy of folders, subfolders, and files.
const data = {
  "Intro": {
    "Timeline": {
      "File 1": "",
      "File 2": "Content for Folder 1 > SubFolder 1-1 > File 2",
      "File 3": "Content for Folder 1 > SubFolder 1-1 > File 3"
    },
    "Resources": {
      "musictheory.net": "",
      "File 2": "Content for Folder 1 > SubFolder 1-2 > File 2",
      "File 3": "Content for Folder 1 > SubFolder 1-2 > File 3"
    }
  },
  "Folder2": {
    "SubFolder 2-1": {
      "File 1": "Content for Folder 2 > SubFolder 2-1 > File 1",
      "File 2": "Content for Folder 2 > SubFolder 2-1 > File 2",
      "File 3": "Content for Folder 2 > SubFolder 2-1 > File 3"
    },
    "SubFolder 2-2": {
      "File 1": "Content for Folder 2 > SubFolder 2-2 > File 1",
      "File 2": "Content for Folder 2 > SubFolder 2-2 > File 2",
      "File 3": "Content for Folder 2 > SubFolder 2-2 > File 3"
    }
  },
  "Folder3": {
    "SubFolder 3-1": {
      "File 1": "Content for Folder 3 > SubFolder 3-1 > File 1",
      "File 2": "Content for Folder 3 > SubFolder 3-1 > File 2",
      "File 3": "Content for Folder 3 > SubFolder 3-1 > File 3"
    },
    "SubFolder 3-2": {
      "File 1": "Content for Folder 3 > SubFolder 3-2 > File 1",
      "File 2": "Content for Folder 3 > SubFolder 3-2 > File 2",
      "File 3": "Content for Folder 3 > SubFolder 3-2 > File 3"
    }
  }
};

// Build the tree view when the document is ready.
document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("menu");

  // Create a tree node for a folder, subfolder, or file.
  // 'type' can be "folder", "subfolder", or "file".
  // 'level' is a number (1, 2, or 3) for indentation.
  // For subfolder and file, folderKey is the parent folder.
  // For file, subfolderKey is the parent subfolder.
  function createTreeNode(name, type, level, folderKey = null, subfolderKey = null) {
    const li = document.createElement("li");
    li.classList.add("tree-node");
    li.textContent = name;
    li.setAttribute("data-level", level);
    li.setAttribute("data-type", type);
    if (type === "folder") {
      li.dataset.folder = name;
    } else if (type === "subfolder") {
      li.dataset.folder = folderKey;
      li.dataset.subfolder = name;
    } else if (type === "file") {
      li.dataset.folder = folderKey;
      li.dataset.subfolder = subfolderKey;
      li.dataset.file = name;
    }

    // When a node is clicked, handle based on its type.
    li.addEventListener("click", function (e) {
      e.stopPropagation();
      if (type === "folder" || type === "subfolder") {
        const siblings = li.parentElement.querySelectorAll(`li[data-level="${level}"]`);
        siblings.forEach(sib => {
          if (sib !== li) {
            sib.classList.remove("active");
            const childUl = sib.querySelector("ul.child-menu");
            if (childUl) {
              collapse(childUl);
            }
          }
        });
        li.classList.toggle("active");
        toggleExpand(li);
      } else if (type === "file") {
  // Remove the active class from all file nodes
  const fileNodes = menu.querySelectorAll('li[data-level="3"]');
  fileNodes.forEach(node => node.classList.remove("active"));
  li.classList.add("active");
  const folder = li.dataset.folder;
  const subfolder = li.dataset.subfolder;
  const file = li.dataset.file;
  // Retrieve the content from the data object.
  // This content can include any valid HTML (images, bold tags, indents, etc.)
  const rawContent = data[folder][subfolder][file];
  const contentArea = document.querySelector(".content-placeholder");
  // Clear previous content and insert the file title as a header.
  contentArea.innerHTML = `<h1>${file}</h1>`;
  // Insert the raw HTML content provided in the data.
  contentArea.insertAdjacentHTML('beforeend', rawContent);
        }
    });
    return li;
  }

  // Collapse an expanded child menu with animation, then remove it.
  function collapse(childUl) {
    childUl.classList.remove("expanded");
    childUl.addEventListener("transitionend", function () {
      if (childUl.parentElement) { 
        childUl.remove();
      }
    }, { once: true });
  }

  // Toggle expansion for a folder or subfolder.
  function toggleExpand(node) {
    const childUl = node.querySelector("ul.child-menu");
    if (childUl) {
      collapse(childUl);
    } else {
      const nodeType = node.dataset.type;
      const ul = document.createElement("ul");
      ul.classList.add("child-menu");
      if (nodeType === "folder") {
        const folderKey = node.dataset.folder;
        const subfolders = Object.keys(data[folderKey]);
        subfolders.forEach(subKey => {
          const subNode = createTreeNode(subKey, "subfolder", 2, folderKey);
          ul.appendChild(subNode);
        });
      } else if (nodeType === "subfolder") {
        const folderKey = node.dataset.folder;
        const subfolderKey = node.dataset.subfolder;
        const files = Object.keys(data[folderKey][subfolderKey]);
        files.forEach(fileKey => {
          const fileNode = createTreeNode(fileKey, "file", 3, folderKey, subfolderKey);
          ul.appendChild(fileNode);
        });
      }
      node.appendChild(ul);
      // Force a reflow and then trigger the transition.
      ul.getBoundingClientRect();
      ul.classList.add("expanded");
    }
  }

  // Build the initial tree—the top-level folder nodes (level 1).
  Object.keys(data).forEach(folderKey => {
    const folderNode = createTreeNode(folderKey, "folder", 1);
    menu.appendChild(folderNode);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      const tabId = button.getAttribute("data-tab");
      const targetContent = document.getElementById(`${tabId}-content`);

      // Toggle the target dropdown; hide others.
      tabContents.forEach(content => {
        if (content === targetContent) {
          content.style.display =
            content.style.display === "block" ? "none" : "block";
        } else {
          content.style.display = "none";
        }
      });
    });
  });
});
