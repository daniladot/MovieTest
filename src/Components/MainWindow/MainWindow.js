import React, {useEffect, useState} from "react"
import classes from './MainWindow.module.scss'
import axios from "axios"
import TableRow from "./TableRow/TableRow"

const MainWindow = (props) => {

    const [content, setContent] = useState({
        content: {},
        pagination: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        paginationMultiply: 9,
        activePagintionTab: 1,
        commentArr: [],
        comment: []
    })

    const getContent = async () => {
        const contentCopy = {...content}
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=10`)
        if (response.data.data.movies) {
            contentCopy.movies = response.data.data.movies
        }
        setContent(contentCopy)
    }

    const getPageContent = async (e) => {
        let response = ''
        const contentCopy = {...content}
        if (e.target.innerHTML === 1) {
            response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=10`)
        } else {
            response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=10&page=${e.target.innerHTML}`)
        }
        if (response.data.data.movies) {
            contentCopy.movies = response.data.data.movies
        }
        contentCopy.activePagintionTab = +e.target.innerHTML
        setContent(contentCopy)
        defaultAttribute()
    }

    const changePaginationPlus = async () => {
        const contentCopy = {...content}
        const newArrPagination = []
        contentCopy.pagination.forEach(elem => {
            elem += contentCopy.paginationMultiply
            newArrPagination.push(elem)
        })
        contentCopy.pagination = newArrPagination
        contentCopy.activePagintionTab = contentCopy.pagination[0]
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=10&page=${contentCopy.activePagintionTab}`)

        if (response.data.data.movies) {
            contentCopy.movies = response.data.data.movies
        }
        setContent(contentCopy)
        defaultAttribute()
    }

    const changePaginationMinus = async () => {
        const contentCopy = {...content}
        const newArrPagination = []
        contentCopy.pagination.forEach(elem => {
            elem -= contentCopy.paginationMultiply
            newArrPagination.push(elem)
        })
        contentCopy.pagination = newArrPagination
        contentCopy.activePagintionTab = contentCopy.pagination[0]
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=10&page=${contentCopy.activePagintionTab}`)

        if (response.data.data.movies) {
            contentCopy.movies = response.data.data.movies
        }
        setContent(contentCopy)
        defaultAttribute()
    }

    const openCommentBlock = (e) => {
        if (e.target.closest('.table-row').getAttribute('data-comment-block') === 'Y'){
            e.target.closest('.table-row').setAttribute('data-comment-block', '')
        } else {
            e.target.closest('.table-row').setAttribute('data-comment-block', 'Y')
        }
    }

    const defaultAttribute = () => {
        document.querySelectorAll('.table-row').forEach(elem => {
            if(elem.getAttribute('data-comment-block') === 'Y'){
                elem.closest('.table-row').setAttribute('data-comment-block', '')
            }
        })
    }

    const changeComment = (e) => {
        const contentCopy = {...content}
        if(contentCopy.commentArr.find(elem => elem.id === e.target.id)){
            contentCopy.commentArr.find(elem => elem.id === e.target.id).value = e.target.value
        } else {
            contentCopy.commentArr.push({id: e.target.id, value: e.target.value})
        }

        setContent(contentCopy)
    }

    const addValueComment = (id) => {
        if(content.commentArr.length !== 0 && content.commentArr.find(elem => +elem.id === id)){
            let value = content.commentArr.find(elem => +elem.id === id)
            return value.value
        } else {
            return ''
        }
    }

    const addComment = (e) => {
        const contentCopy = {...content}
        const id = e.target.parentElement.childNodes[0].id
        const value =  e.target.parentElement.childNodes[0].innerHTML
        if(contentCopy.comment.length === 0 && id && value){
            contentCopy.comment.push({id: id, contentValue: [value]})
        } else if (contentCopy.comment.find(elem => elem.id === id)){
            contentCopy.comment.find(elem => elem.id === id).contentValue.push(value)
        } else if (id && value) {
            contentCopy.comment.push({id: id, contentValue: [value]})
        }
        setContent(contentCopy)
    }

    const addValueCommentArr = (id) => {
        if(content.comment.length !== 0 && content.comment.find(elem => +elem.id === id)){
            let value = content.comment.find(elem => +elem.id === id)
            return value
        }
    }

    const deleteComment = (id, e) => {
        const contentCopy = {...content}
        if(contentCopy.comment.find(elem => +elem.id === id)){
            const findObject = contentCopy.comment.find(elem => +elem.id === id)
            const index = findObject.contentValue.indexOf(e.target.parentElement.childNodes[0].innerHTML)
            findObject.contentValue.splice(index,1)
        }

        setContent(contentCopy)
    }


    useEffect(() => {
        getContent()
    }, [])

    console.log(content)
    return (
        <div className={classes.MainWindow}>
            {content.movies
                ? content.movies.map((elem, index) => (
                    <TableRow
                        key={index}
                        index={index}
                        id={index + 1 + content.activePagintionTab * 10}
                        URL={elem.background_image}
                        title={elem.title}
                        year={elem.year}
                        urlTorrent={elem.torrents[0].url}
                        openCommentBlock={openCommentBlock}
                        changeComment={changeComment}
                        addValueComment={addValueComment}
                        addComment={addComment}
                        addValueCommentArr={addValueCommentArr}
                        deleteComment={deleteComment}
                    />
                ))
                : null
            }

            <div className={classes.PaginationBlock}>
                {content.pagination[0] !== 1
                    ? <div className={classes.PaginationItem}
                           onClick={() => changePaginationMinus()}
                    >...</div>
                    : null
                }
                {content.pagination.map((elem, index) => (
                    <div className={classes.PaginationItem}
                         key={index}
                         onClick={(e) => getPageContent(e)}
                         data-active={content.pagination[index] === content.activePagintionTab ? 'Y' : null}
                    >{elem}</div>
                ))}
                <div className={classes.PaginationItem}
                     onClick={() => changePaginationPlus()}
                >...
                </div>
            </div>
        </div>
    )
}

export default MainWindow