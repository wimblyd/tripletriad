document.addEventListener("DOMContentLoaded", () => {
  const logDiv = document.getElementById('operation-log');
  const cards = document.querySelectorAll('.card');

  const createImg = (className, src, alt) => Object.assign(document.createElement("img"), { className, src, alt });

  // Mathematical!
  const renderNumber = (container, count) => {
    container.innerHTML = "";
    if (count >= 100) container.appendChild(createImg("counter-number", "img/Star.png", "100"));
    else count.toString().split("").forEach(d => container.appendChild(createImg("counter-number", `img/${d}.png`, d)));
  };

  // It's Log!
  const addLogEntry = message => {
    if (!logDiv) return;
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2,'0')} ${now.toLocaleString('en-US',{month:'short'})} ${now.getFullYear()} | ${now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true})}`;
    const entry = `[${timestamp}] ${message}`;
    let color = "#ffffff";
    if (/^Lost\s/.test(message) || /cleared/i.test(message)) color = "#ffbe32";
    else if (/^Acquired\s/.test(message)) color = "#0384fc";
    const entryDiv = Object.assign(document.createElement("div"), { textContent: entry });
    entryDiv.style.color = color;
    logDiv.appendChild(entryDiv);
    logDiv.scrollTop = logDiv.scrollHeight;
    const logs = JSON.parse(localStorage.getItem("operationLog") || "[]");
    logs.push({ message: entry, color });
    localStorage.setItem("operationLog", JSON.stringify(logs));
  };

  const saveCardState = (id, state) => localStorage.setItem(id, state);

  // Mobile log toggle
  const logToggleBar = document.getElementById('logToggleBar');
  if (logToggleBar) {
    const arrow = logToggleBar.querySelector('.arrow');
    if (window.innerWidth <= 480) logDiv.classList.add('mobile-hidden');
    logToggleBar.addEventListener('click', () => {
      const isHidden = logDiv.classList.toggle('mobile-hidden');
      if (arrow) arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
    });
  }

  // Come on and get your Log!
  (JSON.parse(localStorage.getItem("operationLog") || "[]")).forEach(entryObj => {
    const div = document.createElement('div');
    if (typeof entryObj === "string") div.textContent = entryObj;
    else {
      div.textContent = entryObj.message;
      div.style.color = entryObj.color;
    }
    logDiv.appendChild(div);
  });
  logDiv.scrollTop = logDiv.scrollHeight;

  // Shuffle or Boogie
  cards.forEach(card => {
    const cardId = card.dataset.cardId;
    const cardInner = card.querySelector(".card-inner");

    const counter = card.querySelector(".card-counter") || (() => {
      const div = document.createElement("div");
      div.className = "card-counter";
      div.dataset.cardId = cardId.replace("card-", "");
      const numberContainer = document.createElement("div");
      numberContainer.className = "counter-number-container";
      const upArrow = createImg("counter-arrow up", "img/UpArrow.png", "+1");
      const downArrow = createImg("counter-arrow down", "img/DownArrow.png", "-1");
      div.append(upArrow, numberContainer, downArrow);
      cardInner.appendChild(div);
      return div;
    })();

    const boostBtn = card.querySelector(".boost-button") || (() => {
      const img = createImg("boost-button", "img/Boost.png", "Show counter");
      cardInner.appendChild(img);
      return img;
    })();

    const syncCardUI = () => {
      const flipped = localStorage.getItem(cardId) === "flipped";
      const boostUsed = localStorage.getItem(`${cardId}-boost`) === "used";
      card.classList.toggle("flipped", flipped);
      card.setAttribute("aria-pressed", flipped ? "true" : "false");
      boostBtn.classList.toggle("used", boostUsed);
      card.classList.toggle("boost-locked", flipped && boostUsed);

      const count = parseInt(localStorage.getItem(`card-${cardId.replace("card-","")}-count`) || "0", 10);
      renderNumber(counter.querySelector(".counter-number-container"), count);
      counter.classList.toggle("visible", count > 0);
    };

    syncCardUI();

    // Counter
    card.addEventListener("click", () => {
      const boostUsed = boostBtn.classList.contains("used");
      if (boostUsed && card.classList.contains("flipped")) return;
      const flipped = !card.classList.contains("flipped");
      card.classList.toggle("flipped", flipped);
      saveCardState(cardId, flipped ? "flipped" : "unflipped");
      card.setAttribute("aria-pressed", flipped ? "true" : "false");
      card.classList.toggle("boost-locked", flipped && boostUsed);
      addLogEntry(flipped ? `Acquired ${card.title}` : `Lost ${card.title}`);
    });

    counter.querySelector(".up").addEventListener("click", e => {
      e.stopPropagation();
      const idNumber = cardId.replace("card-","");
      let count = parseInt(localStorage.getItem(`card-${idNumber}-count`) || "0",10);
      count = Math.min(100, count + 1);
      localStorage.setItem(`card-${idNumber}-count`, count);
      renderNumber(counter.querySelector(".counter-number-container"), count);
      addLogEntry(`${card.title} count changed to ${count}`);
      counter.classList.add("visible");
    });

    counter.querySelector(".down").addEventListener("click", e => {
      e.stopPropagation();
      const idNumber = cardId.replace("card-","");
      let count = parseInt(localStorage.getItem(`card-${idNumber}-count`) || "0",10);
      count = Math.max(0, count - 1);
      localStorage.setItem(`card-${idNumber}-count`, count);
      renderNumber(counter.querySelector(".counter-number-container"), count);
      addLogEntry(`${card.title} count changed to ${count}`);
      if(count===0) counter.classList.remove("visible");
    });

    boostBtn.addEventListener("click", e => {
      e.stopPropagation();
      const boostKey = `${cardId}-boost`;
      const idNumber = cardId.replace("card-","");
      let count = parseInt(localStorage.getItem(`card-${idNumber}-count`) || "0",10);
      if (localStorage.getItem(boostKey) === "used") {
        count = 0;
        counter.classList.remove("visible");
        boostBtn.classList.remove("used");
        card.classList.remove("boost-locked");
        localStorage.removeItem(boostKey);
        addLogEntry(`${card.title} count cleared`);
      } else {
        count = 1;
        counter.classList.add("visible");
        boostBtn.classList.add("used");
        if (card.classList.contains("flipped")) card.classList.add("boost-locked");
        localStorage.setItem(boostKey,"used");
        addLogEntry(`${card.title} count changed to ${count}`);
      }
      localStorage.setItem(`card-${idNumber}-count`, count);
      renderNumber(counter.querySelector(".counter-number-container"), count);
    });
  });

  // Storage sync
  window.addEventListener("storage", () => cards.forEach(card => {
    const cardId = card.dataset.cardId;
    const counter = card.querySelector(".card-counter");
    if(!counter) return;
    const numberContainer = counter.querySelector(".counter-number-container");
    const idNumber = cardId.replace("card-","");
    const count = parseInt(localStorage.getItem(`card-${idNumber}-count`) || "0",10);
    renderNumber(numberContainer, count);
    counter.classList.toggle("visible", count>0);

    const flipped = localStorage.getItem(cardId) === "flipped";
    card.classList.toggle("flipped", flipped);
    card.setAttribute("aria-pressed", flipped ? "true":"false");
    const boostUsed = localStorage.getItem(`${cardId}-boost`) === "used";
    card.classList.toggle("boost-locked", flipped && boostUsed);
    card.querySelector(".boost-button")?.classList.toggle("used", boostUsed);
  }));

  // Unflipadelphia
  document.getElementById("resetButton")?.addEventListener("click", () => {
    cards.forEach(card => {
      const cardId = card.dataset.cardId;
      card.classList.remove("flipped","boost-locked");
      saveCardState(cardId,"unflipped");
      card.setAttribute("aria-pressed","false");
      localStorage.removeItem(`${cardId}-boost`);
      const idNumber = cardId.replace("card-","");
      localStorage.setItem(`card-${idNumber}-count`,0);
      const counter = card.querySelector(".card-counter");
      if(counter){
        counter.classList.remove("visible");
        counter.querySelector(".counter-number-container").innerHTML="";
      }
      card.querySelector(".boost-button")?.classList.remove("used");
    });
    addLogEntry("Cards unflipped");
  });

  // Copy log
  document.getElementById("copyLogButton")?.addEventListener("click",()=>{
    const text = Array.from(logDiv.children).map(d=>d.textContent).join("\n");
    navigator.clipboard.writeText(text).then(()=>addLogEntry("Log copied to clipboard")).catch(console.error);
  });

  // Clear log
  document.getElementById("clearLogButton")?.addEventListener("click",()=>{
    logDiv.innerHTML="";
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2,'0')} ${now.toLocaleString('en-US',{month:'short'})} ${now.getFullYear()} | ${now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true})}`;
    const entry = `[${timestamp}] Log cleared`;
    localStorage.setItem("operationLog",JSON.stringify([entry]));
    logDiv.appendChild(Object.assign(document.createElement("div"),{textContent:entry}));
    logDiv.scrollTop = logDiv.scrollHeight;
  });

  // Clock
  const updateClock=()=>document.getElementById('sys-clock').textContent=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  setInterval(updateClock,1000); updateClock();

  // Pop Out
  const popOutButton = document.getElementById("popOutBtn");
  let popOutWin = null;
  popOutButton?.addEventListener("click", () => {
    const screenDiv = document.querySelector(".screen");
    if(!screenDiv) return;
    if(popOutWin && !popOutWin.closed){ popOutWin.focus(); return; }

    const rect = screenDiv.getBoundingClientRect();
    const paddingWidth = 20, paddingHeight = 40;
    const minWidth = window.innerWidth*0.85;
    const minHeight = window.innerHeight*0.85;
    const winWidth = Math.max(rect.width+paddingWidth,minWidth);
    const winHeight = Math.max(rect.height+paddingHeight,minHeight);
    const features = `width=${Math.ceil(winWidth)},height=${Math.ceil(winHeight)},scrollbars=no,resizable=yes`;
    popOutWin = window.open("", "_blank", features);

    [...document.querySelectorAll("link[rel='stylesheet'], style")].forEach(s=>popOutWin.document.head.appendChild(s.cloneNode(true)));

    const style = document.createElement("style");
    style.textContent = `
      html, body.popout-mode { margin:0; padding:0; width:100%; height:100%; display:flex; justify-content:center; align-items:flex-start; background:black; overflow:hidden; }
      .popout-mode .screen { display:inline-flex; flex-wrap:wrap; justify-content:flex-start; align-items:flex-start; width:auto; max-width:100%; padding:2px; gap:8px; box-sizing:border-box; overflow:auto; margin:10px; }
    `;
    popOutWin.document.head.appendChild(style);
    popOutWin.document.body.classList.add("popout-mode");
    popOutWin.document.body.appendChild(screenDiv);

    popOutWin.addEventListener("beforeunload", ()=>{
      document.querySelector(".wrapper").appendChild(screenDiv);
      location.reload();
    });

    setTimeout(()=>{ 
      const screenRect = screenDiv.getBoundingClientRect();
      popOutWin.resizeTo(Math.max(screenRect.width+paddingWidth,minWidth), Math.max(screenRect.height+paddingHeight,minHeight));
    },100);
  });

  // Tooltip
  const tooltip = document.createElement("div");
  tooltip.textContent = "Pop Out The Card Screen";
  Object.assign(tooltip.style,{position:"fixed",background:"#e8e8e8",color:"black",border:"1px solid #808080",borderTopColor:"#fff",borderLeftColor:"#fff",padding:"2px 6px",fontSize:"11px",fontFamily:"Tahoma, sans-serif",boxShadow:"2px 2px 0 #00000033",borderRadius:"2px",pointerEvents:"none",transition:"opacity 0.15s ease",opacity:"0",zIndex:"9999"});
  document.body.appendChild(tooltip);

  popOutButton?.addEventListener("mouseenter", e => { tooltip.style.left=`${e.clientX+10}px`; tooltip.style.top=`${Math.max(0,e.clientY-30)}px`; tooltip.style.opacity="1"; });
  popOutButton?.addEventListener("mousemove", e => { tooltip.style.left=`${e.clientX+10}px`; tooltip.style.top=`${Math.max(0,e.clientY-30)}px`; });
  popOutButton?.addEventListener("mouseleave", ()=>tooltip.style.opacity="0");

  // Chocobo World
  const overlay = document.getElementById("boko-overlay");
  const button = document.getElementById("cwBtn");
  const hotspot = document.getElementById("boko-close-hotspot");
  button?.addEventListener("click",()=>overlay.style.display="block");
  overlay?.addEventListener("click", e => { if(e.target===overlay) overlay.style.display="none"; });
  hotspot?.addEventListener("click",()=>overlay.style.display="none");

  // Start Menu
  (function setupHelpMenu(){
    const startBtn = document.getElementById('startBtn');
    if(!startBtn) return;
    const helpMenu = document.createElement('div'); helpMenu.id='helpMenu';
    Object.assign(helpMenu.style,{position:'fixed',bottom:'28px',left:'0',width:'220px',backgroundColor:'#c0c0c0',border:'2px solid #000',padding:'8px 10px',fontFamily:'Tahoma, sans-serif',fontSize:'10px',display:'none',zIndex:'9999',boxShadow:'2px 2px 0 #808080 inset, -1px -1px 0 #fff inset'});
    const helpItems=[
      {icon:'img/icon-click.png',text:'Click Cards to Flip'},
      {icon:'img/icon-unflip.png',text:'Click Again to Unflip'},
      {icon:'img/icon-lock.png',text:'Lock Flipping/Open Card Counter'},
      {icon:'img/PopOut.png',text:'Open Cards in New Window'},
      {icon:'img/icon-save.png',text:'Syncs & Saves to localStorage'},
      {icon:'img/ChocoboWorld.png',text:'Click into the Chocobo World Window'},
      {icon:'img/icon-keys.png',text:'Boko Uses Arrows/Space/R & E keys'},
      {icon:'img/icon-guide.png',text:'Download Guide'}
    ];
    helpItems.forEach(item=>{
      const line = document.createElement('div'); line.textContent=item.text;
      Object.assign(line.style,{background:`url(${item.icon}) no-repeat left center`,backgroundSize:'25px 25px',paddingLeft:'30px',marginBottom:'4px',lineHeight:'25px'});
      if(item.text.includes('Pop Out')) line.style.cursor='pointer', line.addEventListener('click',()=>popOutButton?.click());
      if(item.text.includes('Chocobo')) line.style.cursor='pointer', line.addEventListener('click',()=>overlay.style.display='block');
      if(item.text.includes('Guide')) line.style.cursor='pointer', line.addEventListener('click',()=>{ window.open('https://www.dropbox.com/scl/fi/wzkqfhaz78xm8aazuwyoe/Wimbly-Donner-s-Guide-to-Triple-Triad-v.03.2.pdf?rlkey=v5blv7r5kodab77ksk71ll0sx&e=1&st=srlyik69&dl=1','_blank'); addLogEntry("Guide Downloaded"); });
      helpMenu.appendChild(line);
    });
    document.body.appendChild(helpMenu);
    startBtn.addEventListener('click', e=>{ e.stopPropagation(); helpMenu.style.display=helpMenu.style.display==='none'?'block':'none'; });
    document.addEventListener('click', e=>{ if(!helpMenu.contains(e.target)&&e.target!==startBtn) helpMenu.style.display='none'; });
  })();

});
