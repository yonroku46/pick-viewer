import { List, Icon, Segment } from 'semantic-ui-react';

export default function WikiPage() {
    return(
    <>
    <div className="wiki">
        <h2>| wiki</h2>
        <Segment inverted>
            <List divided inverted relaxed>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='box'/> 테스트환경</List.Header></div>
                <div className="wiki-content"><a href="http://3.36.69.67/" target="_blank" rel="noreferrer">페이지 바로가기</a></div>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='gitlab'/> 소스관리</List.Header></div>
                <div className="wiki-content"><a href="https://github.com/yonroku46/pickProject" target="_blank" rel="noreferrer">https://github.com/yonroku46/pickProject</a></div>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='google drive'/> 파일공유</List.Header></div>
                <div className="wiki-content"><a href="https://drive.google.com/drive/u/2/folders/1RUCFXndt0JV2uYEYFsbCjELNrpD4a_JM" target="_blank" rel="noreferrer">https://drive.google.com/drive/u/2/folders/1RUCFXndt0JV2uYEYFsbCjELNrpD4a_JM</a></div>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='paint brush'/> UI킷</List.Header></div>
                <div className="wiki-content"><a href="https://react.semantic-ui.com/elements/icon/" target="_blank" rel="noreferrer">https://react.semantic-ui.com/elements/icon/</a></div>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='aws'/> AWS설정</List.Header></div>
                <div className="wiki-content"><a href="https://ap-northeast-2.console.aws.amazon.com/console/home?region=ap-northeast-2" target="_blank" rel="noreferrer">https://ap-northeast-2.console.aws.amazon.com/console/home?region=ap-northeast-2</a></div>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                <div className="wiki-header"><List.Header><Icon inverted color='grey' name='bullhorn'/> 기타 참고사항</List.Header></div>
                <div className="wiki-content">
                    <div>
                        # 2021.10.19<br/>
                        <div className="code"><p>현재 없음</p></div></div>
                    </div>
                </List.Content>
            </List.Item>
            </List>
        </Segment>
    </div>
    </>
    )
  };