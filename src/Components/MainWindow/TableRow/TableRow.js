import React from 'react'
import classes from './TableRow.module.scss'

const TableRow = (props) => {
    return (
        <div className={`${classes.TableRow} table-row`} id={props.id}>
            <div className={classes.RowWrapper} data-color-grey={props.index % 2 !== 0 ? 'Y' : null}>
                {
                    props.URL
                        ? <img className={classes.Image} src={props.URL} alt={props.name}/>
                        : <div className={classes.Image}/>
                }
                <div className={classes.Title}>{props.title}</div>
                <div className={classes.Year}>{props.year}</div>
                <a href={props.urlTorrent}>
                    <div className={classes.Button}>Torrent</div>
                </a>
                <div className={classes.OpenCommentBlock}
                     onClick={(e) => props.openCommentBlock(e)}
                />
            </div>

            <div className={classes.CommentBlock}>
                <textarea rows='1' className={classes.Comment} id={props.id}
                          onChange={(e) => props.changeComment(e)} value={props.addValueComment(props.id)}
                          placeholder="Напишите коментарий"/>
                <div className={classes.addComment}
                     onClick={(e) => props.addComment(e)}
                />
            </div>
            <div className={classes.CommentTableBlock}>
                {props.addValueCommentArr(props.id) ? props.addValueCommentArr(props.id).contentValue.map((elem, index) => (

                        <div className={classes.Comment} key={index}>
                            <div>{elem}</div>
                            <div className={classes.DeleteComment}
                                 onClick={(e) => props.deleteComment(props.id, e)}
                            />
                        </div>
                    ))
                    : null
                }
            </div>
        </div>
    )
}

export default TableRow