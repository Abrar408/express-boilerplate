const responses = {
  SALE_RESPONSES: {
    SALE_CREATED: "Sale created successfully.",
    SALE_UPDATED: "Sale updated successfully.",
  },
  INVOICE_RESPONSES: {
    INVOICE_CREATED: "Invoice created successfully.",
    INVOICE_UPDATED: "Invoice updated successfully.",
  },
  LEDGER_RESPONSES: {
    HEAD_CREATE_SUCCESS: "Ledger head created successfully.",
    HEAD_UPDATE_SUCCESS: "Ledger head updated successfully.",
    CREATE_SUCCESS: "Ledger updated successfully.",
    UPDATE_SUCCESS: "Ledger updated successfully.",
  },
  USER_RESPONSES: {
    USER_CREATED: "User created successfully.",
    COULD_NOT_FIND_USER: "Could not find user.",
    EMAIL_NOT_FOUND: "Email not found.",
    EMAIL_ALREADY_EXISTS: "Email is already registered.",
    USERNAME_ALREADY_EXISTS: "Username is already taken.",
    DUPLICATE_FACE_ID: "Duplicate face ID",
    EMAIL_NOT_VERIFIED: "Email not verified.",
    INCORRECT_CREDENTIALS: "Incorrect credentials.",
    PASSWORD_CHANGED_SUCCESS: "Password changed successfully.",
    FORGET_PASSWORD_EMAIL_SENT: "Forget password email sent.",
    USER_UPDATED: "User data has been updated.",
    COULD_NOT_UPDATE_USER: "Could not update user.",
    COULD_NOT_DELETE_USER: "Could not delete user.",
    INCORRECT_OLD_PASSWORD: "Old password is incorrect.",
    UNAUTHORIZED: "User is not authorized.",
  },
  ITEM_RESPONSES: {
    CREATE_SUCCESS: "Item created successfully.",
    UPDATE_SUCCESS: "Item updated successfully.",
    DELETE_SUCCESS: "Item delete successfully.",
    NOT_FOUND: "Item not found.",
  },
  SUPPLIER_RESPONSES: {
    CREATE_SUCCESS: "Supplier created successfully.",
    UPDATE_SUCCESS: "Supplier updated successfully.",
    DELETE_SUCCESS: "Supplier delete successfully.",
    NOT_FOUND: "Supplier not found.",
  },
  CUSTOMER_RESPONSES: {
    CREATE_SUCCESS: "Customer created successfully.",
    UPDATE_SUCCESS: "Customer updated successfully.",
    DELETE_SUCCESS: "Customer delete successfully.",
    NOT_FOUND: "Customer not found.",
  },
  CONTEST_RESPONSES: {
    CREATE_SUCCESS: "Contest created successfully.",
    NOT_FOUND: "Contest not found.",
    UPDATE_SUCCESS: "Contest updated successfully.",
    BOOK_NOT_FOUND: "Book not found in specified contest.",
  },
  ENTITY_RESPONSES: {
    NOT_FOUND: "Could not find any record for this entity yet.",
    ADDED: "Entity added successfully.",
    UPDATED: "Entity updated successfully.",
  },
  STRIPE_RESPONSES: {
    PAYMENT_INTENT_CREATED_SUCCESS: "Payment intent created successfully.",
    PRODUCT_UPDATED_SUCCESS: "Product updated successfully.",
    ALREADY_SUBSCRIBED: "Already subscribed.",
  },
  ERROR_RESPONSES: {
    INVALID_REQUEST:
      "The request is invalid. Please check your input and try again.",
    TOKEN_NOT_PROVIDED: "Token not provided.",
    INVALID_TOKEN: "Invalid token.",
    SOMETHING_WENT_WRONG: "Something went wrong.",
    EMPTY_REQUEST_BODY: "Request body cannot be empty.",
    COULD_NOT_UPDATE: "Could not update.",
  },
  SUPPORT_RESPONSES: {
    MAX_LIMIT_REACHED: "Cannot support more than 50 authors.",
    ALREADY_SUPPORTED: "Already supporting this user.",
  },
  genericResponse: (
    status,
    success,
    data = null,
    error = null,
    message = null
  ) => {
    return {
      status: {
        code: status,
        success: success,
      },
      data: data,
      error: error,
      message: message,
    };
  },
};

module.exports = responses;
