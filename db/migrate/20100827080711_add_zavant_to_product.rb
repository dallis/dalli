class AddZavantToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :eighteenzav, :boolean
    add_column :products, :twentyzav, :boolean
    add_column :products, :fortyzav, :boolean
    add_column :products, :seventyzav, :boolean
    add_column :products, :hundredzav, :boolean
  end

  def self.down
    remove_column :products, :hundredzav
    remove_column :products, :seventyzav
    remove_column :products, :fortyzav
    remove_column :products, :twentyzav
    remove_column :products, :eighteenzav
  end
end
