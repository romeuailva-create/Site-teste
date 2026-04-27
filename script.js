// ── IMAGENS (base64) ──────────────────────────
    const IMG = {
  coxinha: "imagens/coxinha.jpeg",
  empada: "imagens/empada.jpeg",
  pao: "imagens/pao.jpeg",
  quibe: "imagens/quibe.jpeg",
  churros: "imagens/churros.jpeg",
  esfiha: "imagens/esfiha.jpeg",
};

    // ── DADOS: PRODUTOS ───────────────────────────
    const PRODS = [
      { id:1, nome:'Coxinha de Frango',        img:IMG.coxinha, preco:5.50, badge:'Mais Vendido', desc:'Massa crocante com recheio cremoso de frango desfiado e catupiry.' },
      { id:2, nome:'Mini Empada',               img:IMG.empada,  preco:7.90, badge:'Destaque',     desc:'Massa amanteigada sequinha, com recheio cremoso saindo do forno.' },
      { id:3, nome:'Pão de Queijo',             img:IMG.pao,     preco:3.50, badge:null,              desc:'Quentinho, macio por dentro e dourado por fora. Clássico mineiro!' },
      { id:4, nome:'Quibe Assado',              img:IMG.quibe,   preco:6.00, badge:'Saudável',     desc:'Quibe árabe tradicional com hortelã e especiarias, assado no forno.' },
      { id:5, nome:'Churros c/ Doce de Leite',  img:IMG.churros, preco:8.00, badge:'Festivo',      desc:'Crocante, caneladinho e acompanhado de doce de leite cremoso.' },
      { id:6, nome:'Esfiha de Carne',           img:IMG.esfiha,  preco:5.00, badge:null,              desc:'Massa macia com carne moída temperada no estilo árabe.' },
    ];

    // ── DADOS: USUÁRIOS ───────────────────────────
    let USERS = [
      { name:'Administrador', email:'admin@salgados.com', pass:'Admin@123',  role:'admin'   },
      { name:'Cliente Demo',  email:'cliente@demo.com',   pass:'cliente123', role:'cliente' },
    ];

    // ── ESTADO GLOBAL ─────────────────────────────
    let currentUser=null, cart=[], orders=[], orderN=1000;
    let pendingTotal=0, selectedPay='', pixInterval=null, recCode='', recEmail='';

    // ── INIT ──────────────────────────────────────
    renderProds();

    function renderProds() {
      document.getElementById('prodGrid').innerHTML = PRODS.map(p => {
        const badge = p.badge ? '<span class="card-badge">'+p.badge+'</span>' : '';
        return '<div class="card"><div class="card-img">'+badge+'<img src="'+p.img+'" alt="'+p.nome+'" /></div><div class="card-body"><h3>'+p.nome+'</h3><p>'+p.desc+'</p><div class="card-foot"><div class="preco"><small>por unidade</small>R$ '+p.preco.toFixed(2).replace('.',',')+'</div><button class="btn-add" onclick="addCart('+p.id+')">Adicionar</button></div></div></div>';
      }).join('');
    }

    // ── MENU HAMBÚRGUER ───────────────────────────────
    function toggleMenu() {
      const drawer  = document.getElementById('drawer');
      const overlay = document.getElementById('drawerOverlay');
      const btn     = document.getElementById('hamburgerBtn');
      drawer.classList.toggle('open');
      overlay.classList.toggle('open');
      btn.classList.toggle('open');
    }
    function closeMenu() {
      document.getElementById('drawer').classList.remove('open');
      document.getElementById('drawerOverlay').classList.remove('open');
      document.getElementById('hamburgerBtn').classList.remove('open');
    }

    // ── OVERLAY ───────────────────────────────────
    function oClick(e,id){if(e.target===document.getElementById(id))document.getElementById(id).classList.remove('open')}

    // ── LOGIN ─────────────────────────────────────
    function openLogin(tab){document.getElementById('loginOverlay').classList.add('open');switchTab(tab||'login')}
    function closeLogin(){document.getElementById('loginOverlay').classList.remove('open')}
    function switchTab(tab){
      document.getElementById('tLogin').style.display    = tab==='login'    ? '' : 'none';
      document.getElementById('tRegister').style.display = tab==='register' ? '' : 'none';
      document.getElementById('tForgot').style.display   = tab==='forgot'   ? '' : 'none';
      document.getElementById('tabRow').style.display    = tab==='forgot'   ? 'none' : '';
      document.querySelectorAll('.tab-btn')[0].classList.toggle('on',tab==='login');
      document.querySelectorAll('.tab-btn')[1].classList.toggle('on',tab==='register');
      if(tab==='forgot')goFS(1);
    }
    function doLogin(){
      const em=document.getElementById('lEmail').value.trim().toLowerCase();
      const ps=document.getElementById('lPass').value;
      const u=USERS.find(u=>u.email.toLowerCase()===em&&u.pass===ps);
      if(!u){showE('lErr');shake();return}
      hideE('lErr');currentUser=u;applyUser();closeLogin();
      showToast('Bem-vindo(a), '+u.name.split(' ')[0]+'!');
    }
    function applyUser(){
      document.getElementById('btnHLogin').style.display='none';
      document.getElementById('uInfo').style.display='flex';
      document.getElementById('uAvatar').textContent=currentUser.name[0].toUpperCase();
      document.getElementById('uName').textContent=currentUser.name.split(' ')[0];
      // atualiza drawer
      document.getElementById('drawerUser').style.display='flex';
      document.getElementById('drawerAvatar').textContent=currentUser.name[0].toUpperCase();
      document.getElementById('drawerUname').textContent=currentUser.name;
      document.getElementById('drawerUemail').textContent=currentUser.email;
      document.getElementById('drawerLoginItem').style.display='none';
      document.getElementById('drawerLogoutItem').style.display='';
      if(currentUser.role==='admin'){
        const r=document.getElementById('uRole');r.textContent='Admin';r.style.display='';
        document.getElementById('adminPanel').style.display='';
        document.getElementById('drawerAdminItem').style.display='';
        refreshAdmin();
      }
    }
    function doRegister(){
      const n=document.getElementById('rName').value.trim();
      const em=document.getElementById('rEmail').value.trim().toLowerCase();
      const ps=document.getElementById('rPass').value;
      if(!n){setE('rErr','Informe seu nome.');shake();return}
      if(!em.includes('@')){setE('rErr','E-mail inválido.');shake();return}
      if(ps.length<6){setE('rErr','Senha mínimo 6 caracteres.');shake();return}
      if(USERS.find(u=>u.email.toLowerCase()===em)){setE('rErr','E-mail já cadastrado!');shake();return}
      const u={name:n,email:em,pass:ps,role:'cliente'};
      USERS.push(u);currentUser=u;applyUser();closeLogin();
      showToast('Bem-vindo(a), '+n.split(' ')[0]+'!');
    }
    function doLogout(){
      currentUser=null;cart=[];updateCount();
      document.getElementById('btnHLogin').style.display='';
      document.getElementById('uInfo').style.display='none';
      document.getElementById('uRole').style.display='none';
      document.getElementById('adminPanel').style.display='none';
      document.getElementById('lEmail').value='';document.getElementById('lPass').value='';
      // reset drawer
      document.getElementById('drawerUser').style.display='none';
      document.getElementById('drawerLoginItem').style.display='';
      document.getElementById('drawerLogoutItem').style.display='none';
      document.getElementById('drawerAdminItem').style.display='none';
      showToast('Até logo!');
    }

    // ── RECUPERAR SENHA ───────────────────────────
    function goFS(n){
      document.querySelectorAll('.fstep').forEach(s=>s.classList.remove('on'));
      document.getElementById('fs'+n).classList.add('on');
      ['d1','d2','d3'].forEach((id,i)=>{
        const d=document.getElementById(id);d.classList.remove('active','done');
        if(i+1<n)d.classList.add('done');else if(i+1===n)d.classList.add('active');
      });
      document.getElementById('sdots').style.display=n===4?'none':'flex';
    }
    function fStep1(){
      const em=document.getElementById('fEmail').value.trim().toLowerCase();
      if(!USERS.find(u=>u.email.toLowerCase()===em)){showE('fErr1');shake();return}
      hideE('fErr1');recEmail=em;
      recCode=Math.floor(100000+Math.random()*900000).toString();
      document.getElementById('fEmailShow').textContent=em;
      document.getElementById('codeShow').textContent=recCode;
      ['cb1','cb2','cb3','cb4','cb5','cb6'].forEach(id=>{const e=document.getElementById(id);e.value='';e.classList.remove('ok')});
      goFS(2);setTimeout(()=>document.getElementById('cb1').focus(),180);
      showToast('Código gerado!');
    }
    function cIn(el,prev,next){el.value=el.value.replace(/\D/g,'').slice(0,1);el.classList.toggle('ok',!!el.value);if(el.value&&next)document.getElementById(next).focus()}
    function cBk(e,el,prev){if(e.key==='Backspace'&&!el.value&&prev){const p=document.getElementById(prev);p.value='';p.classList.remove('ok');p.focus()}}
    function getCode(){return['cb1','cb2','cb3','cb4','cb5','cb6'].map(id=>document.getElementById(id).value).join('')}
    function resend(){recCode=Math.floor(100000+Math.random()*900000).toString();document.getElementById('codeShow').textContent=recCode;['cb1','cb2','cb3','cb4','cb5','cb6'].forEach(id=>{const e=document.getElementById(id);e.value='';e.classList.remove('ok')});document.getElementById('cb1').focus();showToast('Novo código!')}
    function fStep2(){
      if(getCode()!==recCode){showE('fErr2');shake();['cb1','cb2','cb3','cb4','cb5','cb6'].forEach(id=>{const e=document.getElementById(id);e.value='';e.classList.remove('ok')});document.getElementById('cb1').focus();return}
      hideE('fErr2');document.getElementById('np1').value='';document.getElementById('np2').value='';
      document.getElementById('sBar').style.width='0';document.getElementById('sLbl').textContent='';goFS(3);
    }
    function strengthCheck(){
      const v=document.getElementById('np1').value;let s=0;
      if(v.length>=6)s++;if(v.length>=10)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;
      const l=[{w:'0%',c:'#e5e7eb',t:''},{w:'20%',c:'#ef4444',t:'🔴 Muito fraca'},{w:'40%',c:'#f97316',t:'🟠 Fraca'},{w:'60%',c:'#eab308',t:'🟡 Média'},{w:'80%',c:'#22c55e',t:'🟢 Forte'},{w:'100%',c:'#16a34a',t:'💚 Muito forte'}][s]||{w:'0%',c:'#e5e7eb',t:''};
      const bar=document.getElementById('sBar');bar.style.width=l.w;bar.style.background=l.c;
      const lbl=document.getElementById('sLbl');lbl.textContent=l.t;lbl.style.color=l.c;
    }
    function fStep3(){
      const p1=document.getElementById('np1').value,p2=document.getElementById('np2').value;
      if(p1.length<6||p1!==p2){showE('fErr3');shake();return}
      hideE('fErr3');const u=USERS.find(u=>u.email.toLowerCase()===recEmail);if(u)u.pass=p1;
      goFS(4);showToast('Senha alterada!');
    }

    // ── CARRINHO ──────────────────────────────────
    function addCart(id){
      const p=PRODS.find(p=>p.id===id),i=cart.find(c=>c.id===id);
      if(i)i.qty++;else cart.push({...p,qty:1});
      updateCount();showToast(p.nome+' adicionado!');
    }
    function updateCount(){document.getElementById('cartCount').textContent=cart.reduce((s,c)=>s+c.qty,0)}
    function openCart(){document.getElementById('cartOverlay').classList.add('open');renderCart()}
    function closeCart(){document.getElementById('cartOverlay').classList.remove('open')}
    function renderCart(){
      const body=document.getElementById('cBody'),foot=document.getElementById('cFoot');
      if(cart.length===0){body.innerHTML='<div class="cempty"><p>Seu carrinho está vazio.<br>Adicione alguns salgados!</p></div>';foot.style.display='none';return}
      body.innerHTML=cart.map(it=>'<div class="citem"><img src="'+it.img+'" alt="'+it.nome+'" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0"/><div class="ciinfo"><h4>'+it.nome+'</h4><span>R$ '+(it.preco*it.qty).toFixed(2).replace('.',',')+'</span></div><div class="qrow"><button class="qbtn" onclick="chQ('+it.id+',-1)">−</button><span class="qn">'+it.qty+'</span><button class="qbtn" onclick="chQ('+it.id+',+1)">+</button></div><button class="dbtn" onclick="delIt('+it.id+')">🗑️</button></div>').join('');
      document.getElementById('cTotal').textContent='R$ '+cart.reduce((s,c)=>s+c.preco*c.qty,0).toFixed(2).replace('.',',');
      foot.style.display='block';
    }
    function chQ(id,d){const it=cart.find(c=>c.id===id);if(!it)return;it.qty+=d;if(it.qty<=0)delIt(id);else{updateCount();renderCart()}}
    function delIt(id){cart=cart.filter(c=>c.id!==id);updateCount();renderCart();showToast('Item removido')}

    // ── CHECKOUT ──────────────────────────────────
    function checkout(){
      if(!currentUser){closeCart();openLogin('login');return}
      if(cart.length===0)return;
      pendingTotal=cart.reduce((s,c)=>s+c.preco*c.qty,0);
      document.getElementById('payTotal').textContent='R$ '+pendingTotal.toFixed(2).replace('.',',');
      selectedPay='';
      ['optDebito','optCredito','optPix'].forEach(id=>document.getElementById(id).classList.remove('selected'));
      document.getElementById('pixPanel').classList.remove('show');
      document.getElementById('cardPanel').classList.remove('show');
      clearInterval(pixInterval);closeCart();
      document.getElementById('payOverlay').classList.add('open');
    }
    function closePay(){document.getElementById('payOverlay').classList.remove('open');clearInterval(pixInterval)}

    // ── PAGAMENTO ─────────────────────────────────
    function selectPay(type){
      selectedPay=type;
      ['optDebito','optCredito','optPix'].forEach(id=>document.getElementById(id).classList.remove('selected'));
      document.getElementById('opt'+type.charAt(0).toUpperCase()+type.slice(1)).classList.add('selected');
      document.getElementById('pixPanel').classList.remove('show');
      document.getElementById('cardPanel').classList.remove('show');
      clearInterval(pixInterval);
      if(type==='pix')showPixPanel();else showCardPanel(type);
    }
    function showPixPanel(){
      document.getElementById('pixPanel').classList.add('show');
      const box=document.getElementById('qrcodeBox');box.innerHTML='';
      new QRCode(box,{text:'PIX*Salgados da Vovó*R$'+pendingTotal.toFixed(2)+'*TESTE',width:180,height:180,colorDark:'#3D1A00',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
      let sec=300;document.getElementById('pixTimer').textContent='05:00';
      pixInterval=setInterval(()=>{sec--;if(sec<=0){clearInterval(pixInterval);document.getElementById('pixTimer').textContent='00:00';return}
      document.getElementById('pixTimer').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')},1000);
    }
    function copyPix(){navigator.clipboard.writeText(document.getElementById('pixKeyText').textContent).then(()=>showToast('Chave PIX copiada!')).catch(()=>showToast('Chave copiada!'))}
    function confirmPix(){clearInterval(pixInterval);finishOrder('⚡ PIX')}
    function showCardPanel(type){
      document.getElementById('cardPanel').classList.add('show');
      document.getElementById('payTypeLbl').textContent=type==='credito'?'💰 Cartão de Crédito':'💳 Cartão de Débito';
      document.getElementById('btnPayCard').textContent=type==='credito'?'✅ Pagar no Crédito':'✅ Pagar no Débito';
      ['cardNum','cardName','cardExp','cardCvv'].forEach(id=>document.getElementById(id).value='');
      document.getElementById('cNumDisp').textContent='•••• •••• •••• ••••';
      document.getElementById('cNameDisp').textContent='SEU NOME';
      document.getElementById('cExpDisp').textContent='MM/AA';
      document.getElementById('cFlag').textContent='💳';hideE('cardErr');
    }
    function fmtCard(){
      let raw=document.getElementById('cardNum').value.replace(/\D/g,'').slice(0,16);
      document.getElementById('cardNum').value=raw.replace(/(.{4})/g,'$1 ').trim();
      let flag='💳';if(/^4/.test(raw))flag='🔵';else if(/^5[1-5]/.test(raw))flag='🔴';else if(/^3[47]/.test(raw))flag='🟢';else if(/^6/.test(raw))flag='🟠';
      document.getElementById('cFlag').textContent=flag;
      document.getElementById('cNumDisp').textContent=raw.padEnd(16,'•').replace(/(.{4})/g,'$1 ').trim();
    }
    function fmtName(){const v=document.getElementById('cardName').value.toUpperCase();document.getElementById('cardName').value=v;document.getElementById('cNameDisp').textContent=v||'SEU NOME'}
    function fmtExp(){let raw=document.getElementById('cardExp').value.replace(/\D/g,'').slice(0,4);if(raw.length>=3)raw=raw.slice(0,2)+'/'+raw.slice(2);document.getElementById('cardExp').value=raw;document.getElementById('cExpDisp').textContent=raw||'MM/AA'}
    function confirmCard(){
      const num=document.getElementById('cardNum').value.replace(/\s/g,'');
      const name=document.getElementById('cardName').value.trim();
      const exp=document.getElementById('cardExp').value;
      const cvv=document.getElementById('cardCvv').value;
      if(num.length<16||!name||exp.length<5||cvv.length<3){showE('cardErr');return}
      hideE('cardErr');finishOrder((selectedPay==='credito'?'💰 Crédito':'💳 Débito')+' — **** '+num.slice(-4));
    }

    // ── FINALIZAR ─────────────────────────────────
    function finishOrder(payLabel){
      const num='#'+(++orderN);
      orders.push({id:num,client:currentUser.name,email:currentUser.email,total:pendingTotal,pay:payLabel,date:new Date().toLocaleString('pt-BR')});
      cart=[];updateCount();closePay();
      document.getElementById('orderNum').textContent=num;
      document.getElementById('payDone').textContent='Pago via: '+payLabel;
      document.getElementById('successOverlay').classList.add('open');
      if(currentUser.role==='admin')refreshAdmin();pendingTotal=0;
    }
    function closeSuccess(){document.getElementById('successOverlay').classList.remove('open')}

    // ── ADMIN ─────────────────────────────────────
    function refreshAdmin(){
      const rev=orders.reduce((s,o)=>s+o.total,0);
      document.getElementById('aStats').innerHTML='<div class="acard"><span class="num">'+orders.length+'</span><span class="lbl">Pedidos</span></div><div class="acard"><span class="num">R$'+rev.toFixed(2).replace('.',',')+'</span><span class="lbl">Faturamento</span></div><div class="acard"><span class="num">'+USERS.length+'</span><span class="lbl">Clientes</span></div><div class="acard"><span class="num">'+PRODS.length+'</span><span class="lbl">Salgados</span></div>';
      document.getElementById('oList').innerHTML=orders.length===0?'<p class="empty-msg">Nenhum pedido ainda.</p>':[...orders].reverse().map(o=>'<div class="orow"><span class="oid">'+o.id+'</span><span>👤 '+o.client+'</span><span style="color:var(--cinza);font-size:.8rem">'+o.date+'</span><span style="font-weight:800;color:var(--laranja)">R$ '+o.total.toFixed(2).replace('.',',')+'</span><span style="color:var(--cinza);font-size:.78rem">'+o.pay+'</span><span class="sok">Confirmado</span></div>').join('');
    }

    // ── UTILITÁRIOS ───────────────────────────────
    function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
    function showE(id){document.getElementById(id).style.display='block'}
    function hideE(id){document.getElementById(id).style.display='none'}
    function setE(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block'}
    function shake(){const m=document.getElementById('loginModal');m.style.animation='none';void m.offsetHeight;m.style.animation='shake .4s'}
    document.addEventListener('keydown',e=>{
      if(e.key!=='Enter'||!document.getElementById('loginOverlay').classList.contains('open'))return;
      if(document.getElementById('tLogin').style.display!=='none')doLogin();
      if(document.getElementById('tRegister').style.display!=='none')doRegister();
    });
