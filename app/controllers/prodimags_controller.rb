class ProdimagsController < ApplicationController
  # GET /prodimags
  # GET /prodimags.xml
  def index
    @prodimags = Prodimag.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @prodimags }
    end
  end

  # GET /prodimags/1
  # GET /prodimags/1.xml
  def show
    @prodimag = Prodimag.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @prodimag }
    end
  end

  # GET /prodimags/new
  # GET /prodimags/new.xml
  def new
    @prodimag = Prodimag.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @prodimag }
    end
  end

  # GET /prodimags/1/edit
  def edit
    @prodimag = Prodimag.find(params[:id])
  end

  # POST /prodimags
  # POST /prodimags.xml
  def create
    @prodimag = Prodimag.new(params[:prodimag])

    respond_to do |format|
      if @prodimag.save
        flash[:notice] = 'Prodimag was successfully created.'
        format.html { redirect_to(@prodimag) }
        format.xml  { render :xml => @prodimag, :status => :created, :location => @prodimag }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @prodimag.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /prodimags/1
  # PUT /prodimags/1.xml
  def update
    @prodimag = Prodimag.find(params[:id])

    respond_to do |format|
      if @prodimag.update_attributes(params[:prodimag])
        flash[:notice] = 'Prodimag was successfully updated.'
        format.html { redirect_to(@prodimag) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @prodimag.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /prodimags/1
  # DELETE /prodimags/1.xml
  def destroy
    @prodimag = Prodimag.find(params[:id])
    @prodimag.destroy

    respond_to do |format|
      format.html { redirect_to(prodimags_url) }
      format.xml  { head :ok }
    end
  end
end
