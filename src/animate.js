let width = window.innerWidth
let height = window.innerHeight
let animations = []
let keyhold = false
let shift = false
let ry = 0
let x = 0
let y = -50
let z = 5
let angle = 0
let mixer,standing,move,moveBack,backFlip,obj

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,width/height,0.1,1000)
const Renderer = new THREE.WebGLRenderer()
const controls = new THREE.OrbitControls(camera,Renderer.domElement)
const clock = new THREE.Clock()

Renderer.setSize(width,height)
Renderer.setClearColor(0xe1e1e1)
document.body.appendChild(Renderer.domElement)

window.addEventListener('resize',function(){
    width = window.innerWidth
    height = window.innerHeight
    Renderer.setSize(width,height)
    camera.aspect = width/height
    camera.updateProjectionMatrix()
})

function animate(){
    const loader = new THREE.FBXLoader()
    loader.load(avatar,(fbx)=>{
        obj = fbx

        /*============IDLE=========== */
        const animation1 = new THREE.FBXLoader()
        animation1.load(idle,(anim)=>{
            mixer = new THREE.AnimationMixer(fbx)
            standing = mixer.clipAction(anim.animations[0])
            animations.push(standing)
            standing.play()
        })

        /*============WALKING========== */
        const animation2 = new THREE.FBXLoader()
        animation2.load(walking,(anim)=>{
            move = mixer.clipAction(anim.animations[0])
            animations.push(move)
        })

        /*=============WALK BACKWARD========== */
        const animation3 = new THREE.FBXLoader()
        animation3.load(walkBack,(anim)=>{
            moveBack = mixer.clipAction(anim.animations[0])
            animations.push(moveBack)
        })

        /*=================BACKFLIP============ */
        const animation4 = new THREE.FBXLoader()
        animation4.load(backStunt,(anim)=>{
            backFlip = mixer.clipAction(anim.animations[0])
            animations.push(backFlip)
        })

        fbx.position.set(x,y,z)
        scene.add(fbx)
    })
}

function createAvatar(){
    const light1 = new THREE.AmbientLight(0xffffff,1)
    const light2 = new THREE.DirectionalLight(0xffffff,3)
    scene.add(light1,light2)

    const gridHelper = new THREE.GridHelper(5000,50,0x919191)
    gridHelper.position.set(0,-50,0)
    scene.add(gridHelper)

    animate()
    camera.position.set(0,0,220)
}
createAvatar()

window.addEventListener('keydown',function(e){
    if(e.key == 'ArrowUp'){
        if(mixer){
            if(!keyhold){
                for(let i = 0; i<animations.length; i++){
                    animations[i].stop()
                }
                move.play()
                keyhold = true
            }

            if(angle > 0){
                angle -= Math.PI/25
                obj.rotation.y = angle
            }
            if(angle < 0){
                angle += Math.PI/25
                obj.rotation.y = angle
            }
            obj.position.z += z
      }
    }


    if(e.key == 'ArrowDown'){
        if(mixer){
            if(!shift){
                if(angle < Math.PI && angle > 0){
                    angle += Math.PI/25
                    obj.rotation.y = angle

                    if(!keyhold){
                        for(let i = 0; i<animations.length; i++){
                            animations[i].stop()
                        }
                        move.play()
                        keyhold = true
                    }

                }
                if(angle > -(Math.PI) && angle < 0){
                    angle -= Math.PI/25
                    obj.rotation.y = angle

                    if(!keyhold){
                        for(let i = 0; i<animations.length; i++){
                            animations[i].stop()
                        }
                        move.play()
                        keyhold = true
                    }

                }

                else{
                    if(!keyhold){
                        for(let i = 0; i<animations.length; i++){
                            animations[i].stop()
                        }
                        moveBack.play()
                        keyhold = true
                    }
                }
                obj.position.z -= z
            }
            else{
                if(!keyhold){
                    for(let i = 0; i<animations.length; i++){
                        animations[i].stop()
                    }
                    backFlip.play()
                    keyhold = true
                }
            }
      }
    }

    if(e.key == 'ArrowRight'){
        if(mixer){
            if(!keyhold){
                for(let i = 0; i<animations.length; i++){
                    animations[i].stop()
                }
                move.play()
                keyhold = true
            }

            x = 5
            if(angle < Math.PI/2){
                angle += Math.PI/25
                obj.rotation.y = angle
            }
            if(angle > Math.PI/2){
                angle -= Math.PI/25
                obj.rotation.y = angle
            }
            if(angle < -(Math.PI/2)){
                angle = Math.PI/25
                obj.rotation.y += angle
            }
            obj.position.x += x
      }
    }

    if(e.key == 'ArrowLeft'){
        if(mixer){
            if(!keyhold){
                for(let i = 0; i<animations.length; i++){
                    animations[i].stop()
                }
                move.play()
                keyhold = true
            }

            x = 5
            if(angle > -(Math.PI/2)){
                angle -= Math.PI/25
                obj.rotation.y = angle
            }
            if(angle < -(Math.PI/2)){
                angle += Math.PI/25
                obj.rotation.y = angle
            }
            if(angle > Math.PI/2){
                angle = Math.PI/25
                obj.rotation.y -= angle
            }
            obj.position.x -= x

      }
    }
    
    if(e.key == 'Shift'){
        shift = true
    }
})

window.addEventListener('keyup',function(e){
    if(mixer){
        for(let i = 0; i<animations.length; i++){
            animations[i].stop()
        }
        standing.play()
        keyhold = false
    }

    if(e.key == 'ArrowDown'){
        shift = false
    }
})

const animationLoop = ()=>{
    if(mixer){
        mixer.update(clock.getDelta())
    }
    Renderer.render(scene,camera)
    requestAnimationFrame(animationLoop)
}
animationLoop()