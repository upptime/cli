import {getConfig} from './helpers/config'
import {readFile} from 'fs-extra'
import {load} from 'js-yaml'
import {join} from 'path'

export const Dayvalues = async(slug = "") =>{
    
    try{
        const config = await getConfig()
        const exists = config.sites.map(ob => ob.name === `${slug}` ?  true : false)
        if(exists.includes(true)){
            
            const daysArray = (await readFile(join('.', 'history', `${slug.toLowerCase()}`, 'response-time-day.yml'), 'utf8')).split('\n')
            var num = daysArray.length;
            

            var values = []
            if(num < 5+1){
                for(var i=1;i<num;i++){
                    var element : number = +daysArray[i]
                    values.push(element) 
                }
            }
            else{
                var count = 0
                var interval = Math.floor(11/5)
                var sum = 0
                for(var i=1;i<num;i++){
                    if(count >= interval){
                        values.push(Math.floor(sum/interval))
                        sum = 0;
                        count = 0;
                    }
                    var element : number = +daysArray[i]
                    sum+=element
                    count++
                     
                }



            }
            // console.log(values)
            // for(var i=1;i<num;i++){
            //     var element : number = +daysArray[i]
            //     sum+=element
            // }
            
            // daysArray.forEach(element => {
            //     var el : number = +element
            //     sum+=el
            // });
            // console.log(sum)
        }
        else{
            throw Error;
        }
    }
    catch(error){
        console.log(error);
        // output message
    }

}