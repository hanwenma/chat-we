import emotions from '@/assets/emotions.json';

function createMap(arr: any[], key1: string, key2: string) {
    return arr.reduce((memo, curr) => {
        memo[curr[key1]] = curr[key2]
        return memo
    }, {})
}

const emotMap = createMap(emotions, 'title', 'emot');

export default function(){
    return {
        emotions,
        emotMap
    }
}