import { successfulResponse } from "@libs/api-gateway"
import { failureResponse } from "@libs/api-gateway";
import { error } from "console";

const fib = async(event)=>{
    const axios = require('axios').default;
    function fibo(num) {
        var f = Array(num + 2);
        var i;
        f[0] = 0;
        f[1] = 1;

        for (i = 2; i <= n; i++){
            f[i] = f[i-1] + f[i-2];
        }
        return f[n];
    }

    const querystring = event.queryStringParameters;
    if (querystring === null){
        return {
            statusCode: 400,
            body: 'The url should follow the format of an "?input=<any number>"',
        }
    }
    const input = querystring.input ;
    var n = +input;
    
    if (isNaN(n)){
        return failureResponse({
            errorCode : 2 ,
            errorMessage : 'Invalid Input, Input must be a whole number! or the query String must have "Input" as the only parameter'
        })
    }

    if (n >= 1 && n <=150){
        var f = fibo(n);
        try{
            const res = await axios.get('https://2drh5tu9vk.execute-api.us-east-1.amazonaws.com/dev/factorial', {
                params: {
                input: n,
                }
            })
            return successfulResponse({
                input : input,
                factorial : res.data['factorial'],
                fibonacci : f,
            })  
        }
        catch (error){
            if (error.response['status'] === 400){
                return successfulResponse({
                    input : input,
                    factorial : 'The input is out of range for the Factorial API',
                    fibonacci : f,
                }) 
            }else{
                return successfulResponse({
                    input : input,
                    factorial : 'The Factorial API is down',
                    fibonacci : f,
                })
            }
            
        }
        
    } else {
        return failureResponse({
            errorCode : 1 ,
            errorMessage : 'Number is out of acceptable range, Acceptable range [1 to 150]'
        })
    }
}

export const main=fib;