import {useState} from 'react';
import {connect} from 'react-redux';

import dateFormat from '../utils/dateFormat';
import {getListSearch, getItemDetail, deleteListItem} from '../store/actions/list';
import {Alert, Button, Collapse, List, Modal} from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel.js";
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import {ListItemText} from "@mui/material";
function ListSearches({
                          onClickItem,
                          ...props
                      }) {
    const [openList, setOpenList] = useState(false);
    const [openListOnce, setOpenListOnce] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [selectedItemForDeleting, setSelectedItemForDeleting] = useState({});

    const onClickOpenDialog = (item) => {
        setSelectedItemForDeleting(item);
        setOpenDialogDelete(true);
    }

    const onDeleteConfirm = () => {
        props.deleteListItem(selectedItemForDeleting);
        setOpenDialogDelete(false);
    }

    const onCollapseList = () => {
        if (!openListOnce) {
            props.getListSearch();
            setOpenListOnce(true);
        }
        setOpenList(!openList);
    }

    const onCloseDialog = () => {
        setOpenDialogDelete(false);
    }

    const onClickItemDetail = (item) => {
        props.getItemDetail(item);
        onClickItem?.(item);
    }

    const parseDate = (date) => (
        <time
            dateTime={date}
            title={dateFormat(date, {dateStyle: 'full', timeStyle: 'medium'})}
        >
            {dateFormat(date, {dateStyle: 'medium'})}
        </time>
    );

    return (
        <>
            <br/>
            <Collapse
                className="collapseList"
                in={openList}
                timeout="auto"
                expandIconPosition="end"
            >
                <CollapsePanel header="History" key="1">
                    <List>
                        {(props.dataList || []).map((item) =>
                            <List.Item key={item.id}
                                       actions={
                                           [
                                               <Button type="primary" shape="circle" icon={<EyeOutlined />}
                                                       onClick={() => onClickItemDetail(item)}/>
                                               ,
                                               <Button type="primary" shape="circle" icon={<DeleteOutlined/>}
                                                       onClick={() => onClickOpenDialog(item)}/>
                                           ]
                                       }
                            >
                                <ListItemText
                                    primary={item.title}
                                    secondary={parseDate(item.created_at)}
                                    title={item.title}
                                />
                            </List.Item>
                        )}
                    </List>


                    {props.dataList?.length < 1 &&
                        <Alert
                            message="Info"
                            description="No Data"
                            type="info"
                            showIcon
                        />
                    }
                </CollapsePanel>
            </Collapse>
            <Modal
                open={openDialogDelete}
                onClose={onCloseDialog}
                onOk={onDeleteConfirm}
                okText="Delete"
                onCancel={onCloseDialog}
            >
                <p>Are you sure to delete {selectedItemForDeleting?.title || "this item"} ?</p>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        dataList: state.listSearch.dataList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getListSearch: () => {
            dispatch(getListSearch());
        },
        getItemDetail: (item) => {
            dispatch(getItemDetail(item));
        },
        deleteListItem: (item) => {
            dispatch(deleteListItem(item));
        },
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)((ListSearches));
