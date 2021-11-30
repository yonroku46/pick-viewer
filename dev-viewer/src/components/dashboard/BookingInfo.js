import { Label, Icon } from 'semantic-ui-react'

export default function BookingInfo(props) {
    return(
        <>
        <Label className='dashboard-viewer-title' attached='top'>
            <Icon name='chart bar outline'/>예약정보
        </Label> 
        </>
    );
}