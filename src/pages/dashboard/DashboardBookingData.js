import { Label, Icon, Form, Header, Progress } from 'semantic-ui-react'

export default function DashboardBookingData(props) {
    return(
        <>
        <Form className='dashboard-viewer-inline'>
            <Form.Field>
                <label><Icon name='angle right'/>최근 한달 예약수</label>
                <Header className='dashboard-shopinfo-text'>0건</Header>
            </Form.Field>
            <Form.Field>
                <label><Icon name='angle right'/>예약 분석차트</label>
                <Header className='dashboard-shopinfo-text'>요일별 / 시간별</Header>
                    <Progress className='dashboard-data-progress' percent={44} color='blue' size='small' progress/>
                    <Progress className='dashboard-data-progress' percent={60} color='green' size='small' progress/>
                    <Progress className='dashboard-data-progress' percent={23} color='violet' size='small' progress/>
                    <Progress className='dashboard-data-progress' percent={18} color='purple' size='small' progress/>
                    <Progress className='dashboard-data-progress' percent={57} color='teal' size='small' progress/>
            </Form.Field>
            <div className='dashboard-content-final-empty'> </div>
        </Form>
        </>
    );
}