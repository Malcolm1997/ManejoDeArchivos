const fs = require('fs')



class Contenedor{

    constructor(nombre){
        this.nombre = nombre;
        this.id = this.lastId    
    }

    static dataDelArchivo = [];

    async save(data){
        this.id++
        data.id = this.id
        Contenedor.dataDelArchivo.push(data)

        await this.cargarArchivo()

        return this.id
    }

    async cargarArchivo(){
        try{
            await fs.promises.writeFile(this.nombre, JSON.stringify(Contenedor.dataDelArchivo))
        }
        catch (error) {
        console.log("El error de carga es:" + error)
        }
    }

    async init(){
        try{
            let data = await fs.promises.readFile(this.nombre, "utf8")
            Contenedor.dataDelArchivo = JSON.parse(data)

            let lastId

            Contenedor.dataDelArchivo.forEach(el => {
                el.id > lastId ? lastId = el.id : null
            })
        }
        catch (error) {
        console.log("Todavia no se a ingresado ningun archivo")
        }
    }

    getById(id){
        let data
        try {
            data = Contenedor.dataDelArchivo.length ? Contenedor.dataDelArchivo.filter(el => el.id == id) : console.log("No cargo todavia")
            return data.length ? data[0].title : null
        } catch (error) {
            console.log(error)
        }
    }



    getAll(){
        try{
            console.log(Contenedor.dataDelArchivo)
            return Contenedor.dataDelArchivo
        }
        catch(error){
            console.log("No se pudieron entregar todos los datos")
        }
         
    }

    async deleteById(id){
        Contenedor.dataDelArchivo = await Contenedor.dataDelArchivo.filter(el => el.id != id)
        try{
            
            await this.cargarArchivo()

        }
        catch (error) {
            console.log(error)
        }
        
    }

    async deleteAll(){
            try{
                await fs.promises.unlink(this.nombre)
            }
            catch(err){
                console.log("No se a encontrado el archivo")
            }
        
    }
}






const run = async () => {
    
    let archivo = new Contenedor("./archivo.json")
    await archivo.init()


    archivo.save({
        title:'Escuadra',
        price:123.45,
        thumbnail:'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
    },)
    archivo.save({
        title:'Calculadora',
        price:234.56,
        thumbnail:'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png', 
    },)

    archivo.save({
        title:'Globo Terráqueo',
        price:345.67,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',
    },)
    
    console.log(archivo.getById(2))
    archivo.getAll()
}

run()