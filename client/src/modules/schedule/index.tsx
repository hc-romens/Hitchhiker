import React from 'react';
import { connect, Dispatch } from 'react-redux';
import ScheduleList from './schedule_list';
import { DtoSchedule } from '../../../../api/interfaces/dto_schedule';
import { DtoUser } from '../../../../api/interfaces/dto_user';
import { State } from '../../state/index';
import * as _ from 'lodash';
import { DtoEnvironment } from '../../../../api/interfaces/dto_environment';
import { actionCreator } from '../../action/index';
import { Layout } from 'antd/lib';
import Splitter from '../../components/splitter';
import { UpdateLeftPanelType, ResizeLeftPanelType } from '../../action/ui';

const { Content, Sider } = Layout;

interface ScheduleStateProps {

    collapsed: boolean;

    leftPanelWidth: number;

    user: DtoUser;

    activeSchedule: string;

    collections: _.Dictionary<string>;

    environments: _.Dictionary<string>;
}

interface ScheduleDispatchProps {

    resizeLeftPanel(width: number);

    collapsedLeftPanel(collapsed: boolean);

    createSchedule(schedule: DtoSchedule);

    selectSchedule(scheduleId: string);

    updateSchedule(schedule: DtoSchedule);

    deleteSchedule(schedule: DtoSchedule);
}

type ScheduleProps = ScheduleStateProps & ScheduleDispatchProps;

interface ScheduleState { }

class Schedule extends React.Component<ScheduleProps, ScheduleState> {

    public render() {
        const { collapsed, leftPanelWidth, collapsedLeftPanel, createSchedule, selectSchedule, updateSchedule, deleteSchedule, user, activeSchedule, collections, environments } = this.props;

        return (
            <Layout className="main-panel">
                <Sider
                    className="collection-sider"
                    style={{ minWidth: collapsed ? 0 : leftPanelWidth }}
                    collapsible={true}
                    collapsedWidth="0.1"
                    collapsed={collapsed}
                    onCollapse={collapsedLeftPanel}>
                    <ScheduleList
                        schedules={[]}
                        user={user}
                        activeSchedule={activeSchedule}
                        collections={collections}
                        environments={environments}
                        createSchedule={createSchedule}
                        selectSchedule={selectSchedule}
                        updateSchedule={updateSchedule}
                        deleteSchedule={deleteSchedule}
                    />
                </Sider>
                <Splitter resizeCollectionPanel={this.props.resizeLeftPanel} />
                <Content className="team-right-panel">

                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = (state: State): ScheduleStateProps => {
    const { leftPanelWidth, collapsed } = state.uiState.appUIState;
    let collections: _.Dictionary<string> = {};
    let environments: _.Dictionary<string> = {};
    _.values(state.collectionState.collectionsInfo.collections).forEach(c => collections[c.id] = c.name);
    _.chain(state.environmentState.environments).values().flatten<DtoEnvironment>().value().forEach(e => environments[e.id] = e.name);
    return {
        leftPanelWidth,
        collapsed,
        user: state.userState.userInfo,
        activeSchedule: '',
        collections,
        environments
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): ScheduleDispatchProps => {
    return {
        createSchedule: (schedule) => dispatch(actionCreator('', schedule)),
        updateSchedule: (schedule) => dispatch(actionCreator('', schedule)),
        deleteSchedule: (schedule) => dispatch(actionCreator('', schedule)),
        selectSchedule: (schedule) => dispatch(actionCreator('', schedule)),
        collapsedLeftPanel: (collapsed) => dispatch(actionCreator(UpdateLeftPanelType, collapsed)),
        resizeLeftPanel: (width) => dispatch(actionCreator(ResizeLeftPanelType, width)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Schedule);