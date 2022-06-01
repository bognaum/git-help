
window.addEventListener("load", function(e){
	
	const version = "2.3.0";

	const cS = document.querySelector(".contents-section");
	if (!cS)
		return;

	cS.dataset.contents_sectionVer = version;
	cS.classList.add("activated");
	
	var parentEl = cS.parentElement;

	var 
		coll = parentEl.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		html = "";
		

	for (var i = 0; i < coll.length; i++) {
		let 
			h      = coll[i],
			hId    = h.id || "hr-"+i,
			hType  = h.nodeName.toLowerCase(),
			reduct = hType == "h1" ? getReduction(h) : 0,
			text   = h.textContent.replace(/</g, "&lt;")

		h.setAttribute("id", `${hId}_header`);
		h.appendChild(
			eHTML(`
				<a 
					class="contents-section--scroll-to-content-list"
					href="#${ hId }_cl_link"
				></a>
			`)
		);

		html += `
			<div class="${hType}-link-div ${reduct ? "reduced-by-"+reduct : ""}">
				<a href="#${hId+"_header"}" class="${hType}-link-a" name="${hId}_cl_link">${text}</a>
			</div>
		`;
	}

	cS.innerHTML += html;

	function getReduction(el) {
		let 
			reduct  = 0,
			current = el;

		while (current = current.parentElement)
			if ([
				"article", 
				"aside", 
				"nav", 
				"section"
			].includes(current.nodeName.toLowerCase())) 
				reduct ++;

		return 6 < reduct ? 6 : reduct;
	}

	function eHTML(code, shell=null) {
		const _shell = 
			! shell                  ? document.createElement("div") :
			typeof shell == "string" ? document.createElement(shell) :
			typeof shell == "object" ? shell :
				null;
		_shell.innerHTML = code;
		return _shell.children[0];
	}

}, false);
