import {getConfig} from './helpers/config'
import {readFile} from 'fs-extra'
import {join} from 'path'
import cli from 'cli-ux'
import chalk from 'chalk'

export const Dayvalues = async(slug = "") =>{
    try{
        const config = await getConfig()
        const exists = config.sites.map(ob => ob.name === `${slug}` ?  true : false)
        if(exists.includes(true)){
            
            // change structure before push
            const daysArray = (await readFile(join('.', 'history', 'response-data' ,`${slug.toLowerCase()}`, 'response-time-day.yml'), 'utf8')).split('\n')
            var num = daysArray.length;
            
            var values = []
            if(num < 5+1){
                for(var i=1;i<num;i++){
                    var element : number = +daysArray[i]
                    values.push(element) 
                }
            }
            else{
                // var testArray = ['100','200','300','700','150','220','350','780','190','210','360','600']
                // num = testArray.length
                var count = 0
                var interval = Math.floor(num/5)
                var sum = 0
                for(var i=1;i<num+1;i++){
                    console.log("in")
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
        }
        else{
            throw Error;
        }
    }
    catch(error){
        console.log(error);
        // output message
        cli.action.stop(chalk.red('Some issue fetching response time data'))
    }
    // return array
    return values;
}

export const Weekvalues = async(slug = "") =>{
    try{
        const config = await getConfig()
        const exists = config.sites.map(ob => ob.name === `${slug}` ?  true : false)
        if(exists.includes(true)){
            
            // change structure before push
            const daysArray = (await readFile(join('.', 'history', 'response-data' ,`${slug.toLowerCase()}`, 'response-time-week.yml'), 'utf8')).split('\n')
            var num = daysArray.length;
            
            var values = []
            if(num < 7+1){
                for(var i=1;i<num;i++){
                    var element : number = +daysArray[i]
                    values.push(element) 
                }
            }
            else{
                var count = 0
                var interval = Math.floor(num/7)
                var sum = 0
                for(var i=1;i<num+1;i++){
                    console.log("in")
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
        }
        else{
            throw Error;
        }
    }
    catch(error){
        console.log(error);
        // output message
        cli.action.stop(chalk.red('Some issue fetching response time data'))
    }
    // return array
    return values;
}


export const Monthvalues = async(slug = "") =>{
    try{
        const config = await getConfig()
        const exists = config.sites.map(ob => ob.name === `${slug}` ?  true : false)
        if(exists.includes(true)){
            
            // change structure before push
            const daysArray = (await readFile(join('.', 'history', 'response-data' ,`${slug.toLowerCase()}`, 'response-time-week.yml'), 'utf8')).split('\n')
            var num = daysArray.length;
            
            var values = []
            if(num < 10+1){
                for(var i=1;i<num;i++){
                    var element : number = +daysArray[i]
                    values.push(element) 
                }
            }
            else{
                var count = 0
                var interval = Math.floor(num/10)
                var sum = 0
                for(var i=1;i<num+1;i++){
                    console.log("in")
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
        }
        else{
            throw Error;
        }
    }
    catch(error){
        console.log(error);
        // output message
        cli.action.stop(chalk.red('Some issue fetching response time data'))
    }
    // return array
    return values;
}


export const Yearvalues = async(slug = "") =>{
    try{
        const config = await getConfig()
        const exists = config.sites.map(ob => ob.name === `${slug}` ?  true : false)
        if(exists.includes(true)){
            
            // change structure before push
            const daysArray = (await readFile(join('.', 'history', 'response-data' ,`${slug.toLowerCase()}`, 'response-time-week.yml'), 'utf8')).split('\n')
            var num = daysArray.length;
            
            var values = []
            if(num < 12+1){
                for(var i=1;i<num;i++){
                    var element : number = +daysArray[i]
                    values.push(element) 
                }
            }
            else{
                var count = 0
                var interval = Math.floor(num/12)
                var sum = 0
                for(var i=1;i<num+1;i++){
                    console.log("in")
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
        }
        else{
            throw Error;
        }
    }
    catch(error){
        console.log(error);
        // output message
        cli.action.stop(chalk.red('Some issue fetching response time data'))
    }
    // return array
    return values;
}







