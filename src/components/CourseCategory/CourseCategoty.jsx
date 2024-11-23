import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseCategory,
  fetchCourseCategorybyId,
  getAllCourseCategory,
  updateCourseCategory,
} from "../../Redux/Course/Action";
import { FaEdit } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Navbar from "../Navbar/Navbar";

const Coursecategory = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [onEditing, setonEditing] = useState(false);

  const handleClose = () => {
    if (!onEditing) {
      setShow(false);
      setcourseCategory("");
    } else {
      setShow(false);
      setonEditing(false);
      setcourseCategory("");
    }
  };
  const { getAllCourseCatagory, getCoursebyId } = useSelector(
    (store) => store.course
  );

  const [courseCategory, setcourseCategory] = useState({
    id: "",
    category: "",
    categoryDesc: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setcourseCategory({ ...courseCategory, [name]: value });
    }
  };
  useEffect(() => {
    dispatch(getAllCourseCategory());
  }, [dispatch]);

  useEffect(() => {
    if (getCoursebyId) {
      setcourseCategory((prevData) => ({
        ...prevData,
        id: getCoursebyId.id,
        category: getCoursebyId.category,
        categoryDesc: getCoursebyId.categoryDesc,
      }));
    }
  }, [getCoursebyId]);

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (onEditing) {
      dispatch(updateCourseCategory(getCoursebyId.id, courseCategory)).then(
        () => {
          handleClose();
          dispatch(getAllCourseCategory());
          setonEditing(false);
          setcourseCategory("");
        }
      );
    } else {
      dispatch(addCourseCategory(courseCategory)).then(() => {
        dispatch(getAllCourseCategory());
        setShow(false);
        setcourseCategory("");
      });
    }
  };

  const handleShow = () => {
    setShow(true);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };
  const filteredData = getAllCourseCatagory?.filter((item) =>
    item.subCategory?.toLowerCase().includes(search.toLowerCase())
  );
  const dataToShow = getAllCourseCatagory?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handelfetchCourse = (row) => {
    dispatch(fetchCourseCategorybyId(row.id));
    setShow(true);
    setonEditing(true);
  };
  const columns = [
    {
      name: "Sn",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Subject category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Subject Description",
      selector: (row) => row.categoryDesc,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row,
      sortable: true,
      cell: (row) => (
        <div>
          <button
            type="button"
            className="btn btn-warning text-white btn-sm me-2"
            onClick={() => handelfetchCourse(row)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#478CCF",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        minHeight: "50px",
        color: "black",
        "&:nth-of-type(odd)": {
          backgroundColor: "white",
        },
        "&:nth-of-type(even)": {
          backgroundColor: " lightgrey",
        },
        "&:hover": {
          backgroundColor: "#f2f2f2",
        },
      },
    },
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="container-fluid mt-4">
        <div className="row mainbtn mb-0  align-items-center">
          <div className="col-auto d-flex align-items-center">
            <button className="btn btn-primary" onClick={handleShow}>
              CREATE CATEGORY
            </button>
          </div>
        </div>
        {/* data table card3 */}
        <div className="card3">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="left-header text-primary">COURSE CATAGORY LIST</h5>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search"
                className="form-control search-input w-25"
              />
            </div>
            {/* datatable */}
            <DataTable
              columns={columns}
              data={dataToShow || []}
              pagination
              paginationServer
              paginationTotalRows={filteredData.length || 0}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              className="responsive-table"
              customStyles={customStyles}
            />
          </div>
        </div>
        {/* modal */}
        {show && <div className="modal-backdrop fade show"></div>}
        <div
          className={`modal fade ${show ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">
                  <b>{onEditing ? "Update Category" : "Add Category"}</b>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCategorySubmit}>
                  <div className="form-group mb-3 ">
                    <label htmlFor="category">
                      <b>Course Category</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      id="category"
                      value={courseCategory.category || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-3 ">
                    <label htmlFor="categoryDesc">
                      <b>Course Description</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="categoryDesc"
                      id="categoryDesc"
                      value={courseCategory.categoryDesc || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      {onEditing ? "UPDATE" : "SUBMIT"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Coursecategory;