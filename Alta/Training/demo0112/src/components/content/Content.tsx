import React, {useState} from 'react'; 
import { useAppSelector, useAppDispatch } from '../../libraries/hook';
import { testSlice as testSliceAction } from '../../stores/testSlice';
 
const Content = () => {
    const [text, setText] = useState('');
    const dispatch = useAppDispatch(); 
    const myTest = useAppSelector((state) => state.test);
    const handleClick = (item: string) => {
        dispatch(testSliceAction.actions.addItem(item));
    }
    return (
        <div>
            <input type="text" value={text} onChange={(e)=>setText(e.currentTarget.value)}
            onKeyUp={(e) => {
                if(e.key === 'Enter'){
                    dispatch(testSliceAction.actions.addItem(text));
                    setText('');
                }
            }} />
            {myTest.items.map((item, index) => 
            <h1 key={index}>{item}</h1>)}
        </div>
    );
}

export default Content;