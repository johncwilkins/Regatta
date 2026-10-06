import * as THREE from './vendor/three.module.js';

// Built once per boat; shown only for the recorded winner at the moorings.
export function addMooringParty(root,index){
 const group=new THREE.Group();group.name='Winning boat celebration crew';group.visible=false;root.add(group);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.8});
 const skin=[mat(0xe0a375),mat(0x955e43)],shirts=[mat(0x28a9c0),mat(0xee7449)],shorts=mat(0x24384c),hair=mat(0x49362b),foam=mat(0xfff1cb),beer=mat(0xe8ad32);
 const mesh=(parent,geometry,material,x,y,z)=>{const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);parent.add(o);return o};
 const people=[];
 for(let i=0;i<2;i++){
  const person=new THREE.Group();person.name='Seated celebrating sailor';person.position.set(-1.4-i*.65,.42,i===0?-.48:.48);group.add(person);
  mesh(person,new THREE.BoxGeometry(.28,.12,.26),shorts,0,.035,0);
  mesh(person,new THREE.CylinderGeometry(.13,.15,.34,10),shirts[(i+index)%2],0,.25,0);
  mesh(person,new THREE.SphereGeometry(.13,12,8),skin[i],0,.57,0);
  const cap=mesh(person,new THREE.SphereGeometry(.132,12,8,0,Math.PI*2,0,Math.PI/2),hair,0,.605,0);cap.rotation.z=.08;
  // Thighs rest on the deck; lower legs hang into the cockpit.
  for(const z of [-.085,.085]){
   const thigh=mesh(person,new THREE.CylinderGeometry(.055,.06,.22,8),shorts,.12,-.01,z);thigh.rotation.z=Math.PI/2;
   mesh(person,new THREE.CylinderGeometry(.045,.055,.24,8),skin[i],.23,-.16,z);
   mesh(person,new THREE.BoxGeometry(.13,.065,.09),shorts,.265,-.29,z);
  }
  const toast=new THREE.Group();toast.name='Beer toast arm';toast.position.set(0,.39,.16);person.add(toast);
  mesh(toast,new THREE.CylinderGeometry(.04,.055,.29,8),skin[i],0,-.145,0);
  mesh(toast,new THREE.SphereGeometry(.055,8,6),skin[i],0,-.30,0);
  const mug=new THREE.Group();mug.name='Beer mug';mug.position.set(.02,-.36,0);toast.add(mug);
  mesh(mug,new THREE.CylinderGeometry(.065,.06,.16,10),beer,0,.07,0);
  mesh(mug,new THREE.CylinderGeometry(.069,.065,.032,10),foam,0,.16,0);
  const handle=mesh(mug,new THREE.TorusGeometry(.045,.013,5,12),foam,.074,.07,0);handle.rotation.y=Math.PI/2;
  const throwing=new THREE.Group();throwing.name='Confetti throwing arm';throwing.position.set(0,.39,-.16);person.add(throwing);
  mesh(throwing,new THREE.CylinderGeometry(.04,.055,.28,8),skin[i],0,-.14,0);
  mesh(throwing,new THREE.SphereGeometry(.055,8,6),skin[i],0,-.29,0);
  people.push({person,toast,mug,throwing});
 }
 const colors=[0xffcf42,0xf45d74,0x35d8cc,0x739aff,0xf7efff],count=192;
 const confetti=new THREE.InstancedMesh(new THREE.BoxGeometry(.12,.025,.07),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),count);confetti.name='Winner mooring confetti';confetti.frustumCulled=false;group.add(confetti);
 for(let i=0;i<count;i++)confetti.setColorAt(i,new THREE.Color(colors[i%colors.length]));
 const dummy=new THREE.Object3D();
 // Two staggered rocket bursts, using a fixed pool rather than creating particles per frame.
 const sparksPerBurst=96,fireworks=new THREE.InstancedMesh(new THREE.SphereGeometry(.085,5,4),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),sparksPerBurst*2);
 fireworks.name='Winner mooring fireworks';fireworks.frustumCulled=false;group.add(fireworks);
 const flash=new THREE.PointLight(0xffd277,0,24,2);flash.name='Firework glow';flash.position.set(-1.5,8,0);group.add(flash);
 return {group,people,confetti,fireworks,setWinner(winner){group.visible=winner},update(time,wind,strength){if(!group.visible)return;
  people.forEach(({person,toast,mug,throwing},i)=>{
   const phase=time*.9+i*2.4,drinking=Math.max(0,Math.sin(phase));person.rotation.x=.045*Math.sin(time*2+i);
   toast.rotation.z=2.0+drinking*.92;mug.rotation.z=-toast.rotation.z-drinking*.35;
   throwing.rotation.z=-2.15-.7*Math.sin(time*3+i);throwing.rotation.x=.25*Math.sin(time*2+i);
  });
  // Fixed-size particle pool. Coordinates are local, so heel and bobbing carry the party.
  const relative=wind*Math.PI/180+Math.PI+root.rotation.y,drift=Math.min(.9,strength/20);
  for(let i=0;i<count;i++){
   const person=i%2,t=(time+i*.047)%3.4,v=t/3.4,spread=(i%19-9)*.09;
   dummy.position.set(-1.4-person*.65+spread+Math.cos(relative)*drift*v,1.1+7*v-7.7*v*v,(person?1:-1)*.48+(i%17-8)*.08+Math.sin(relative)*drift*v);
   dummy.rotation.set(time*2+i,time*3+i*.7,time*2.5+i*.4);const size=v>.88?(1-v)/.12:1;dummy.scale.setScalar(Math.max(0,size));dummy.updateMatrix();confetti.setMatrixAt(i,dummy.matrix);
  }
  confetti.instanceMatrix.needsUpdate=true;
  let glow=0;
  for(let burst=0;burst<2;burst++){
   const age=(time+burst*2.8)%5.6,launch=age<.9,height=9+burst*2,elapsed=Math.max(0,age-.9),fade=Math.max(0,1-elapsed/2.1),radius=elapsed*3.7;
   glow=Math.max(glow,launch?0:Math.max(0,1-elapsed/.45)*18);
   for(let j=0;j<sparksPerBurst;j++){
    const k=burst*sparksPerBurst+j,vertical=1-2*(j+.5)/sparksPerBurst,angle=j*2.399963,ring=Math.sqrt(1-vertical*vertical);
    dummy.position.set(-1.5+burst*2+(launch?0:radius*ring*Math.cos(angle)),launch?1+height*age/.9:height+1+radius*vertical-1.2*elapsed*elapsed,burst?1.8:-1.8);
    if(!launch)dummy.position.z+=radius*ring*Math.sin(angle);
    dummy.rotation.set(0,0,0);dummy.scale.setScalar(launch?(j===0?1.8:0):fade*(1+(j%3)*.18));dummy.updateMatrix();fireworks.setMatrixAt(k,dummy.matrix);
    fireworks.setColorAt(k,new THREE.Color(launch?0xffe3a0:colors[(j+burst+Math.floor(time/5.6))%colors.length]));
   }
  }
  flash.intensity=glow;fireworks.instanceMatrix.needsUpdate=true;fireworks.instanceColor.needsUpdate=true;
 }};
}
