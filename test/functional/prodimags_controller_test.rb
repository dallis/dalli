require 'test_helper'

class ProdimagsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:prodimags)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create prodimag" do
    assert_difference('Prodimag.count') do
      post :create, :prodimag => { }
    end

    assert_redirected_to prodimag_path(assigns(:prodimag))
  end

  test "should show prodimag" do
    get :show, :id => prodimags(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => prodimags(:one).to_param
    assert_response :success
  end

  test "should update prodimag" do
    put :update, :id => prodimags(:one).to_param, :prodimag => { }
    assert_redirected_to prodimag_path(assigns(:prodimag))
  end

  test "should destroy prodimag" do
    assert_difference('Prodimag.count', -1) do
      delete :destroy, :id => prodimags(:one).to_param
    end

    assert_redirected_to prodimags_path
  end
end
