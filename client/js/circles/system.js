class System {
    constructor() {
        this.circles = [];
        this.canMultiply = true;
        this.forceFactory = new ForceFactory();
        this.forces = new Forces()
        this.spring = .02;
        this.friction = -0.9;
        this.maxspeed = 3; 
        this.maxforce = 0.2; 
        this.seekStrength = 1;
        this.mouse = {
            diameter: 200
        };
        this.activeForces = [];        
    }
    initControls(){
        this.forces.types.forEach(({name, key, description})=>{
            $('#Controls').append(`<button data="${key}" class="btn ${key}" data-toggle="tooltip" data-placement="top" title="${description}">${name}</button>`)
            $('.'+key).click((e)=>{                               
                $(e.target).toggleClass('btn-default btn-success')
                this.toggleForce(key)
                this.updateForces();
            })
            $('#stop').click(()=>{
                this.stopAll();
            })
        })
        // $(() => {
            $('[data-toggle="tooltip"]').tooltip()
        //   })      
    }
    initModal(){
        $('#introModal').modal('show');        
        this.forces.types.forEach(({name,description})=>{
            $('#forceDescriptions').append(`
            <tr>
                <th scope="row">${name}</th>
                <td>${description}</td>                       
            </tr>            
            `)
        })        
    }
    addCircle(c) {
        this.circles.push(c);
    }
    removeCircle(){
        this.circles.pop();
    }
    updateForces(){
        this.circles.forEach((c)=>{
            c.applyForce(c, this.activeForces, {
                ceiling: 0,
                floor: window.innerHeight
            })            
        })
    }
    toggleForce(f){   
        let i = this.activeForces.indexOf(f)                  
        if(i === -1){
            this.activeForces.push(f);            
        } else {
            this.activeForces.splice(i,1)
        }        
    }
    stopAll(){
        system.forces.types.forEach(({key})=>{
            $('.' + key).removeClass('btn-default btn-success');
        })
        this.circles.forEach((c)=>{
            c.stop()
        })
        this.activeForces = [];
    }
}