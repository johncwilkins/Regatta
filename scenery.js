import * as THREE from './vendor/three.module.js';
export function addYachtClub(scene){
 const club=new THREE.Group();club.name='Island Heights Yacht Club · stylized';club.position.set(170,0,-170);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.85});const shingle=mat(0x9c9386),trim=mat(0xece2c9),roof=mat(0x485c50),wood=mat(0x806548),glass=mat(0x344e5b);
 const box=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);club.add(o);return o};
 const shore=new THREE.Mesh(new THREE.CylinderGeometry(48,52,1.5,48),mat(0x6c8250));shore.scale.z=.65;shore.position.set(0,.15,13);club.add(shore);
 box(38,1.2,24,0,1,0,wood);box(29,9,17,0,6,3,shingle);
 const top=new THREE.Mesh(new THREE.ConeGeometry(22,5,4),roof);top.rotation.y=Math.PI/4;top.scale.z=.65;top.position.set(0,13,3);club.add(top);
 box(36,.65,5,0,6,-8,trim);box(36,.4,5,0,2,-8,trim);
 for(let x=-17;x<=17;x+=4.25){box(.3,4, .3,x,4,-10,trim);box(.28,3,.28,x,8,-10,trim)}
 for(const y of [6.4,9.4]){box(36,.22,.22,0,y,-10,trim);box(36,.18,.18,0,y-1,-10,trim)}
 for(let x=-12;x<=12;x+=4){box(2.2,2.4,.18,x,8, -5.6,glass);box(2.5,.16,.25,x,9.3,-5.8,trim);box(.12,2.4,.25,x,8,-5.8,trim)}
 box(4,.7,31,12,.9,-26,wood);for(let z=-38;z<-11;z+=6)box(.4,2,.4,14,0,z,wood);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,17,8),trim);pole.position.set(-21,9,-9);club.add(pole);
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(4,2),new THREE.MeshBasicMaterial({color:0xd94243,side:THREE.DoubleSide}));flag.position.set(-19,16,-9);club.add(flag);
 for(let i=0;i<5;i++){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,6,6),wood);trunk.position.set(-30+i*14,3,26);club.add(trunk);const tree=new THREE.Mesh(new THREE.ConeGeometry(5,11,7),mat(0x355d3d));tree.position.set(-30+i*14,10,26);club.add(tree)}
 scene.add(club);return club;
}
export function createPuffVisuals(scene){
 const geometry=new THREE.PlaneGeometry(2,2);geometry.rotateX(-Math.PI/2);
 const puffs=Array.from({length:12},()=>{const material=new THREE.MeshBasicMaterial({color:0x003858,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide,stencilWrite:true,stencilRef:1,stencilFunc:THREE.NotEqualStencilFunc});material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','diffuseColor.a *= 1.0-smoothstep(0.12,0.5,length(vMapUv-vec2(0.5)));\n#include <opaque_fragment>');};
 // A tiny white map enables the standard UV varying for the soft edge.
 const map=new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1);map.needsUpdate=true;material.map=map;
 const mesh=new THREE.Mesh(geometry,material);mesh.renderOrder=2;scene.add(mesh);return mesh});
 return patches=>patches.forEach((p,i)=>{const mesh=puffs[i];mesh.position.set(p.x,.09,p.z);mesh.scale.set(p.radiusX,1,p.radiusZ);mesh.rotation.y=-p.angle;mesh.material.opacity=.21+.16*p.power});
}

export function addCommitteeBoat(scene){const root=new THREE.Group();root.name='Committee boat';const hull=new THREE.Mesh(new THREE.BoxGeometry(6,.9,2.2),new THREE.MeshStandardMaterial({color:0xf2eee0,roughness:.6}));hull.position.y=.35;root.add(hull);const stripe=new THREE.Mesh(new THREE.BoxGeometry(6,.16,2.24),new THREE.MeshStandardMaterial({color:0x173f71}));stripe.position.y=.6;root.add(stripe);const cabin=new THREE.Mesh(new THREE.BoxGeometry(2.5,1.8,1.7),new THREE.MeshStandardMaterial({color:0xfafafa}));cabin.position.set(-.6,1.5,0);root.add(cabin);const glass=new THREE.Mesh(new THREE.BoxGeometry(2.55,.6,1.75),new THREE.MeshStandardMaterial({color:0x466b80}));glass.position.set(-.6,1.9,0);root.add(glass);const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,4,8),new THREE.MeshStandardMaterial({color:0xeeeeee}));pole.position.set(1.6,2.4,0);root.add(pole);const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.8),new THREE.MeshBasicMaterial({color:0xf3df37,side:THREE.DoubleSide}));flag.position.set(2.3,4,0);root.add(flag);scene.add(root);return root}

export function addCoastalLandmarks(scene){
 const timber=new THREE.MeshStandardMaterial({color:0x996547,roughness:.85}),white=new THREE.MeshStandardMaterial({color:0xefe7d7,roughness:.6}),steel=new THREE.MeshStandardMaterial({color:0x52778a,metalness:.25,roughness:.5});
 const boardwalk=new THREE.Group();boardwalk.position.set(145,0,201);scene.add(boardwalk);
 const box=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);boardwalk.add(o);return o};
 box(32,.6,9,0,2,0,timber);for(const x of [-14,-7,0,7,14])for(const z of [-3,3])box(.5,4,.5,x,.5,z,timber);
 const wheel=new THREE.Group();wheel.position.set(0,13,0);wheel.rotation.y=Math.PI/2;boardwalk.add(wheel);const rotor=new THREE.Group();wheel.add(rotor);
 for(const radius of [9,10]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.18,6,48),white);rotor.add(ring)}
 const cabins=[];for(let i=0;i<12;i++){const a=i*Math.PI/6,spoke=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,10,6),steel);spoke.position.set(5*Math.cos(a),5*Math.sin(a),0);spoke.rotation.z=a-Math.PI/2;rotor.add(spoke);const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.8,1.3),new THREE.MeshStandardMaterial({color:[0xf26739,0xe6bc35,0x37a7b5,0xb73562][i%4],roughness:.6}));cabin.position.set(10*Math.cos(a),10*Math.sin(a),0);rotor.add(cabin);cabins.push(cabin)}
 for(const z of [-2,2]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,12,8),steel);leg.position.set(0,6,z);leg.rotation.x=z>0?.22:-.22;boardwalk.add(leg)}
 for(const x of [-11,11]){box(5,3.5,6,x,4,0,new THREE.MeshStandardMaterial({color:x<0?0xf2c386:0x72b6b3,roughness:.8}));box(5.7,.6,6.7,x,6,0,white)}
 const ferry=addCommitteeBoat(scene);ferry.name='Distant coastal ferry';ferry.position.set(195,0,-125);ferry.scale.set(2.8,1.6,2.2);ferry.rotation.y=.7;
 return time=>{rotor.rotation.z=time*.035;for(const cabin of cabins)cabin.rotation.z=-rotor.rotation.z;ferry.position.y=.12*Math.sin(time*1.2)};
}
